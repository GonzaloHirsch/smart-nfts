import { IContract, IContractLibrary, IContractMethod, IContractVariable } from "../interfaces/contract.interface";
import * as Template from '../helpers/template.helper';

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
        // missing pragma solidity version
        return this.generateImports(contract.getImports()) +
            this.generateContractContent(contract);
    }

    generateImports = (imports: string[]) => {
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
        return this.arrayTemplateWrapper(
            libraries,
            libraries.map(lib => Template.getLibrary(lib)).join('')
        );
    }

    generateVariables = (variables: IContractVariable[]): string => {
        const varsContent = variables
            .map(v => this.generateVariable(v))
            .join(Template.newLine());

        return this.arrayTemplateWrapper(
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

        return this.arrayTemplateWrapper(
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

    private arrayTemplateWrapper = (array: any[], defaultContent: string): string => {
        return array.length == 0
            ? ''
            : defaultContent;
    }

}

export default TemplateService;
