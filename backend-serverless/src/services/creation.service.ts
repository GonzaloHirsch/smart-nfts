import { EXTENSIONS, EXTENSION_MAP } from "../constants/contract.constants";
import { CustomContract } from "../contracts/custom.contract";
import { hashString } from "../helpers/string.helper";
import { IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import TemplateService from "./template.service";

class CreationService {

    private static instance: CreationService;

    static getInstance = (): CreationService => {

        if (!CreationService.instance) {
            CreationService.instance = new CreationService();
        }
        return CreationService.instance;
    }

    /* saveContract = async () => {

    } */

    genContract = (name: string, symbol: string, extensions: EXTENSIONS[]) : string => {

        const contract = new CustomContract(
            this.genContractImports(extensions),
            name,
            symbol,
            extensions,
            this.genContractLibraries(extensions),
            this.genContractVariables(extensions),
            this.genContractMethods(extensions)
        );

        return TemplateService.getInstance().generateContract(contract);
    };

    private genContractVariables = (extensions: EXTENSIONS[]): IContractVariable[] => {

        return this.genUniqueExtensionList<IContractVariable>(
            extensions, 
            (extension) => EXTENSION_MAP.get(extension)?.getExtensionVariables(),
            (variable) => variable.name
        );
    };

    private genContractLibraries = (extensions: EXTENSIONS[]): IContractLibrary[] => {

        return this.genUniqueExtensionList<IContractLibrary>(
            extensions, 
            (extension) => EXTENSION_MAP.get(extension)?.getExtensionLibs(),
            (lib) => lib.name
        );
    };

    private genContractImports = (extensions: EXTENSIONS[]): string[] => {

        return this.genUniqueExtensionList<string>(
            extensions, 
            (extension) => EXTENSION_MAP.get(extension)?.getExtensionOZImports(),
            (i) => i
        );
    };

    private genUniqueExtensionList = <T>(
        extensions: EXTENSIONS[], 
        listGetter: (ext: EXTENSIONS) => T[] | undefined,
        getHashableField: (element: T) => string
    ): T[] => {
        // HashMap to check naming is unique
        const hashMap: {[hash: number]: T} = {};

        extensions.forEach(extension => {
            // Fetch the variables of the extension
            const list = listGetter(extension) ?? [];
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
    //************ METHODS **************//
    //***********************************//

    private genContractMethods = (extensions: EXTENSIONS[]): IContractMethod[] => {
        return [];
    };
}

export default CreationService;
