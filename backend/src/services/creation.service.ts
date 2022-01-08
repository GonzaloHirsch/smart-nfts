import { EXTENSIONS, EXTENSION_MAP } from "../constants/contract.constants";
import { CustomContract } from "../contracts/custom.contract";
import GenericException from "../exceptions/generic.exception";
import { hashString } from "../helpers/string.helper";
import { IContractExtension, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import TemplateService from "./template.service";

class CreationService {

    private static instance: CreationService;

    constructor() {}

    static getInstance = () => {

        if (!CreationService.instance) {
            CreationService.instance = new CreationService();
        }
        return CreationService.instance;
    }

    saveContract = async () => {

    }

    genContract = (name: string, symbol: string, extensions: EXTENSIONS[]) : string => {

        let classExtensions = extensions.map(extensionName => EXTENSION_MAP.get(extensionName));

        if (classExtensions.some(classExt => classExt == undefined)) {
            throw new Error('missing extension in map');
            // TODO ERROR HANDLING
        }

        classExtensions = classExtensions as IContractExtension[];

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

    private genContractVariables = (extensions:IContractExtension[]): IContractVariable[] => {

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
        const hashMap: {[hash: number]: T} = {};

        extensions.forEach(extension => {
            // Fetch the variables of the extension
            const list = listGetter(extension);
            // Add to the hash map to ensure no repeating variables
            list.forEach(element => {
                // Calculate the hash of the variable name, since this should not be repeated
                const hashName = hashString(getHashableField(element));
                // TODO Log if a variable repeats itself (its an error)
                if (hashMap[hashName] != null) {
                    // TODO Logger
                    console.log(`repeated hash = ${getHashableField(element)}`)
                    return;
                } 
                // Save to the hash map
                hashMap[hashName] = element;
            });
        });
        
        // Return the unique elements
        return Object.values(hashMap);
    }

    //***********************************//
    //******** CONTRACT METHODS *********//
    //***********************************//

    private genContractMethods = (extensions: IContractExtension[]): IContractMethod[] => {
        return [];
    };
}

export default CreationService;
