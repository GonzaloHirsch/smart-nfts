import { EXTENSIONS } from "../constants/contract.constants";
import { IContract, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";

export class CustomContract implements IContract {
    private imports: string[];
    private name: string;
    private symbol: string;
    private extensions: EXTENSIONS[];
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
        this.extensions = extensions
        this.libraries = libraries;
        this.variables = variables;
        this.methods = methods;
    
    }

    getImports(): string[] {
        return this.imports;
    }
    getExtensions(): EXTENSIONS[] {
        return this.extensions;
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