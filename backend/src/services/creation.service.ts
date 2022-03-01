import MissingExtensionException from '../exceptions/missingExtension.exception';
import { EXTENSIONS, EXTENSION_MAP, REQUIRE_KEYWORD } from '../constants/contract.constants';
import { CustomContract } from '../contracts/custom.contract';
import { arrayFindAndRemoveValue, flattenArray, getSortFn } from '../helpers/collection.helper';
import { checkValidExtensions, getExtensionAdditions, getMergedMethodStateMutability, getMergedMethodVisibility } from '../helpers/creation.helper';
import { hashString } from '../helpers/string.helper';
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from '../interfaces/contract.interface';
import { IArguments, IParameter } from '../interfaces/general.interface';
import TemplateService from './template.service';
import InvalidInputException from '../exceptions/invalidInput.exception';
import { typeValidations } from '../helpers/validations.helper';

class CreationService {
    private static instance: CreationService;

    static getInstance = () => {
        if (!CreationService.instance) {
            CreationService.instance = new CreationService();
        }
        return CreationService.instance;
    };

    saveContract = async () => {};

    genContract = (name: string, symbol: string, extensions: EXTENSIONS[], userInputs: IArguments): string => {
        // Check valid name and symbol
        if (!typeValidations.name(name)) {
            throw InvalidInputException.Type('name', 'string', name);
        }
        if (!typeValidations.symbol(symbol)) {
            throw InvalidInputException.Type('symbol', 'string', symbol);
        }

        checkValidExtensions(extensions);

        // Always add the base ERC721 extension
        if (!(extensions.includes(EXTENSIONS.ERC721))) {
            extensions.unshift(EXTENSIONS.ERC721);
        }

        // Unique Storage is added only if mintable or contains storage
        if (extensions.includes(EXTENSIONS.UniqueStorage) && !extensions.includes(EXTENSIONS.Mintable)) {
            extensions = arrayFindAndRemoveValue(extensions, EXTENSIONS.UniqueStorage);
        }

        // Fetch the extension classes
        const classExtensions = extensions.map((extensionName) => {
            if (!EXTENSION_MAP.has(extensionName)) {
                throw new MissingExtensionException(extensionName);
            }
            return EXTENSION_MAP.get(extensionName) as IContractExtension;
        });

        extensions = getExtensionAdditions(extensions);

        const contract = new CustomContract(
            this.genContractImports(classExtensions),
            name,
            symbol,
            extensions,
            this.genContractInputs(classExtensions, userInputs),
            this.genContractLibraries(classExtensions),
            this.genContractVariables(classExtensions),
            this.genContractConstructorContent(classExtensions),
            this.genContractMethods(classExtensions)
        );

        return TemplateService.getInstance().generateContract(contract);
    };

    private genContractVariables = (extensions: IContractExtension[]): IContractVariable[] => {
        return this.genUniqueExtensionList<IContractVariable>(
            extensions,
            (extension) => extension.getExtensionVariables(),
            (variable) => variable.name
        );
    };

    private genContractLibraries = (extensions: IContractExtension[]): IContractLibrary[] => {
        return this.genUniqueExtensionList<IContractLibrary>(
            extensions,
            (extension) => extension.getExtensionLibs(),
            (lib) => lib.name
        );
    };

    private genContractImports = (extensions: IContractExtension[]): string[] => {
        return this.genUniqueExtensionList<string>(
            extensions,
            (extension) => extension.getExtensionOZImports(),
            (i) => i
        );
    };

    private genUniqueExtensionList = <T>(
        extensions: IContractExtension[],
        listGetter: (ext: IContractExtension) => T[],
        getHashableField: (element: T) => string
    ): T[] => {
        // HashMap to check naming is unique
        const hashMap: { [hash: number]: T } = {};

        extensions.forEach((extension) => {
            // Fetch the variables of the extension
            const list = listGetter(extension);
            // Add to the hash map to ensure no repeating variables
            list.forEach((element) => {
                // Calculate the hash of the variable name, since this should not be repeated
                const hashName = hashString(getHashableField(element));
                // TODO Log if a variable repeats itself (its an error)
                if (hashMap[hashName] != null) {
                    // TODO Logger
                    console.log(`repeated hash = ${getHashableField(element)}`);
                    return;
                }
                // Save to the hash map
                hashMap[hashName] = element;
            });
        });

        // Return the unique elements
        return Object.values(hashMap);
    };

    //***********************************//
    //********* CONTRACT INPUTS *********//
    //***********************************//

    private genContractInputs = (extensions: IContractExtension[], inputs: IArguments): IArguments => {
        const validInputs = extensions.flatMap(e => e.getExtensionInputs());

        // Filter out any invalid inputs
        return validInputs
            .reduce((acc: {[inputName: string]: string}, input: IParameter) => {
                const value = inputs[input.name];
                if (value == undefined) {
                    throw InvalidInputException.Missing(input.name, input.type);
                }
                if (!typeValidations[input.type](value)) {
                    throw InvalidInputException.Type(input.name, input.type, value);
                }
                acc[input.name] = value;
                return acc;
            }, {});
    }

    //***********************************//
    //****** CONTRACT CONSTRUCTOR *******//
    //***********************************//

    private genContractConstructorContent = (extensions: IContractExtension[]): string[] => {
        return extensions.flatMap(e => e.getExtensionConstructorContent());
    }

    //***********************************//
    //******** CONTRACT METHODS *********//
    //***********************************//

    private genContractMethods = (extensions: IContractExtension[]): IContractMethod[] => {
        const methodHashMap: { [hash: number]: IContractMethod[] } = {};
        const methodHashOrder: number[] = [];

        // Get parent extensions from the extensions
        const parentExtensions = extensions.map((e) => e.getParentExtension()).filter((parent) => parent !== null);

        // Filter out all parent extension with a child extension present and fetch all methods
        const methods = flattenArray<IContractMethod>(
            extensions.filter((e) => !parentExtensions.includes(e.getExtensionName())).map((e) => e.getExtensionMethods())
        );

        // Seperate the methods by name, if two extensions have the same method, we must merge them
        methods.forEach((method) => {
            const hash = hashString(method.name);

            if (methodHashMap[hash] == null) {
                methodHashMap[hash] = [method];
                methodHashOrder.push(hash)
            } else {
                methodHashMap[hash] = methodHashMap[hash].concat(method);
            }
        });

        // Merge the repeating methods into one and return them
        const finalMethods = methodHashOrder
            .map((methodHash) => this.genMergedContractMethod(methodHashMap[methodHash]))
            .filter((method) => method != null) as IContractMethod[];
        
        // Send the required solidity overrides to the end
        finalMethods.sort(getSortFn<IContractMethod>((m) => !m.solidityRequired));

        return finalMethods;
    };

    private genMergedContractMethod = (methods: IContractMethod[]): IContractMethod | null => {
        // If no method is mandatory, the necessary extention to add this method is missing
        if (!methods.some((m) => m.mandatory)) {
            return null;
        }
        // If there is only one method, then no need to merge it with anything
        if (methods.length === 1) {
            return methods[0];
        }
        // Mandatory methods hold the base of the method so give priority to these
        methods.sort(getSortFn<IContractMethod>((m) => m.mandatory));

        let overrideIsUndefined = true;

        const methodName = methods[0].name;
        const overrideHashMap: { [hash: number]: EXTENSIONS } = {};
        const optionsHashMap: { [hash: number]: string } = {};
        const paramsHashMap: { [hash: number]: boolean } = {};
        const finalParams: IParameter[] = [];
        const content: string[] = flattenArray<string>(methods.map((m) => m.content));

        // Sort the content of the array to bring the requires to the top
        content.sort(getSortFn<string>((c) => c.includes(REQUIRE_KEYWORD)));

        // Get all the unique parameters
        methods.forEach((m) => {
            m.params.forEach((param) => {
                const hash = hashString(param.name);
                if (!paramsHashMap[hash]) {
                    paramsHashMap[hash] = true;
                    finalParams.push(param);
                }
            });
        });

        // Get all unique options
        methods.forEach((m) => {
            m.options?.split(' ').forEach((o) => {
                const hash = hashString(o);
                if (!optionsHashMap[hash]) {
                    optionsHashMap[hash] = o;
                }
            });
        });

        // Get all unique overrides
        methods.forEach((m) => {
            if (m.overrides != null) {
                overrideIsUndefined = false;
            }
            m.overrides?.forEach((o) => {
                const hash = hashString(o);
                if (!overrideHashMap[hash]) {
                    overrideHashMap[hash] = o;
                }
            });
        });

        return {
            name: methodName,
            params: finalParams,
            mandatory: true,
            content: content,
            options: Object.values(optionsHashMap).join(' '),
            visibility: getMergedMethodVisibility(methods.map((m) => m.visibility)),
            stateMutability: getMergedMethodStateMutability(methods.map((m) => m.stateMutability)),
            solidityRequired: methods.every(m => m.solidityRequired === true),
            overrides: overrideIsUndefined ? undefined : Object.values(overrideHashMap)
        };
    };
}

export default CreationService;
