import { EXTENSIONS, FINAL_EXTENSIONS } from "../constants/contract.constants";
import { enumHasKeys } from "../helpers/collection.helper";
import { IContract, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";

export class CustomContract implements IContract {
    private imports: string[];
    private name: string;
    private symbol: string;
    private extensions: EXTENSIONS[];
    private finalExtensions: FINAL_EXTENSIONS[];
    private libraries: IContractLibrary[];
    private variables: IContractVariable[];
    private methods: IContractMethod[];

    constructor (
        imports: string[],
        name: string,
        symbol: string,
        extensions: EXTENSIONS[],
        libraries: IContractLibrary[],
        variables: IContractVariable[],
        methods: IContractMethod[],
    ) {
        this.imports = imports;
        this.name = name;
        this.symbol = symbol;
        this.extensions = extensions;
        this.libraries = libraries;
        this.variables = variables;
        this.methods = methods;
        this.finalExtensions = extensions
            .filter(e => enumHasKeys(FINAL_EXTENSIONS, [e]))
            .map(e => e.toString() as FINAL_EXTENSIONS);
    }

    getImports(): string[] {
        return this.imports;
    }
    getExtensions(): EXTENSIONS[] {
        return this.extensions;
    }
    getFinalExtensions(): FINAL_EXTENSIONS[] {
        return this.finalExtensions;
    }
    getName(): string {
        return this.name;
    }
    getSymbol(): string {
        return this.symbol;
    }
    getLibraries(): IContractLibrary[] {
        return this.libraries;
    }
    getVariables(): IContractVariable[] {
        return this.variables;
    }
    getMethods(): IContractMethod[] {
        return this.methods;
    }
       
}