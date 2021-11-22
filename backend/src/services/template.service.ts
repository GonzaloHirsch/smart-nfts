import { IContract, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import * as Template from '../helpers/template.helper';
import { SOLIDITY_VERSION } from "../constants/contract.constants";

class TemplateService {

    private static instance: TemplateService;

    constructor() {}

    static getInstance = () => {

        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService();
        }
        return TemplateService.instance;
    }

    generateContract = (contract: IContract): string => {
        return this.generateSolidityVersion() +
            this.generateImports(contract.getImports()) +
            this.generateContractContent(contract);
    }

    generateSolidityVersion = (): string => {
        return Template.getSolidityVersion(SOLIDITY_VERSION);
    }

    generateImports = (imports: string[]): string => {
        return Template.newLine() + 
            imports.map(i => Template.getImport(i)).join(Template.newLine());
    }

    generateContractContent = (contract: IContract): string => {
        // Content inside the contract declaration
        const contractContent = [
            this.generateLibraries(contract.getLibraries()),
            this.generateVariables(contract.getVariables()),
            this.generateConstructor(contract),
            this.generateMethods(contract.getMethods())
        ];

        return Template.newLine() +
            Template.getContractStarter(contract.getName(), contract.getExtensions()) +
            Template.getContractContent(
                contractContent.join('')
            );
    }

    generateConstructor = (contract: IContract): string => {
        return Template.newLine() + Template.getConstructor(contract.getName(), contract.getSymbol());
    }

    generateLibraries = (libraries: IContractLibrary[]): string => {
        return Template.arrayWrapper(
            libraries,
            libraries.map(lib => Template.getLibrary(lib)).join('')
        );
    }

    generateVariables = (variables: IContractVariable[]): string => {
        const varsContent = variables
            .map(v => this.generateVariable(v))
            .join(Template.newLine());

        return Template.arrayWrapper(
            variables,
            Template.newLine() + varsContent
        );
    }

    generateVariable = (variable: IContractVariable): string => {
        return Template.getGlobalVariable(variable);
    }

    generateMethods = (methods: IContractMethod[]): string => {
        const methodsContent = methods
            .map(method => this.generateMethod(method))
            .join(Template.newLine());

        return Template.arrayWrapper(
            methods,
            methodsContent
        );
    }

    generateMethod = (method: IContractMethod): string => {
        const params = method.params
            .map(param => `${param.type} ${param.name}`)
            .join(', ');
        
        return Template.newLine() +
            Template.getFunctionStarter(method.name, params) +
            Template.getFunctionDetails([method.visibility, method.options, method.stateMutability]) +
            Template.getFunctionContent(method.content);
    }
}

export default TemplateService;
