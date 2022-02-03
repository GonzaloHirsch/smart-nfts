import MissingExtensionException from '../exceptions/missingExtension.exception';
import { EXTENSIONS, EXTENSION_MAP, REQUIRE_KEYWORD } from '../constants/contract.constants';
import { CustomContract } from '../contracts/custom.contract';
import { flattenArray, getSortFn } from '../helpers/collection.helper';
import { getExtensionAdditions, getMergedMethodStateMutability, getMergedMethodVisibility } from '../helpers/creation.helper';
import { hashString } from '../helpers/string.helper';
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from '../interfaces/contract.interface';
import { IParameter } from '../interfaces/general.interface';
import TemplateService from './template.service';

class CreationService {
    private static instance: CreationService;

    constructor() {}

    static getInstance = () => {
        if (!CreationService.instance) {
        CreationService.instance = new CreationService();
        }
        return CreationService.instance;
    };

    saveContract = async () => {};

    genContract = (name: string, symbol: string, extensions: EXTENSIONS[]): string => {
        // Always add the base ERC721 extension
        if (!(extensions.includes(EXTENSIONS.ERC721))) {
            extensions.unshift(EXTENSIONS.ERC721);
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
            this.genContractLibraries(classExtensions),
            this.genContractVariables(classExtensions),
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
    //******** CONTRACT METHODS *********//
    //***********************************//

    private genContractMethods = (extensions: IContractExtension[]): IContractMethod[] => {
        const methodHashMap: { [hash: number]: IContractMethod[] } = {};

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
            } else {
                methodHashMap[hash] = methodHashMap[hash].concat(method);
            }
        });

        // Merge the repeating methods into one and return them
        const finalMethods = Object.keys(methodHashMap)
            .map((methodHash) => this.genMergedContractMethod(methodHashMap[parseInt(methodHash)]))
            .filter((method) => method != null) as IContractMethod[];
        
        // Send the methods with _ to the end of the contract
        finalMethods.sort(getSortFn<IContractMethod>((m) => !m.name.includes('_')));

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

        const methodName = methods[0].name;
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

        return {
        name: methodName,
        params: finalParams,
        mandatory: true,
        content: content,
        visibility: getMergedMethodVisibility(methods.map((m) => m.visibility)),
        stateMutability: getMergedMethodStateMutability(methods.map((m) => m.stateMutability))
        };
    };
}

export default CreationService;
