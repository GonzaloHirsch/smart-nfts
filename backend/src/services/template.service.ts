import { IContract, IContractLibrary, IContractMethod, IContractVariable } from '../interfaces/contract.interface';
import * as Template from '../helpers/template.helper';
import { SOLIDITY_VERSION, CONTRACT_LICENSE } from '../constants/contract.constants';
import { IArguments } from '../interfaces/general.interface';

class TemplateService {
    private static instance: TemplateService;

    static getInstance = () => {
        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService();
        }
        return TemplateService.instance;
    };

    generateContract = (contract: IContract): string => {
        const stringContract =
            this.generateContractLicense() +
            this.generateContractAttribution() +
            this.generateSolidityVersion() +
            this.generateImports(contract.getImports()) +
            this.generateContractContent(contract);

        return this.replaceUserInputs(stringContract, contract.getUserInputs());
    };

    generateSolidityVersion = (): string => {
        return Template.getSolidityVersion(SOLIDITY_VERSION);
    };

    generateContractLicense = (): string => {
        return Template.getContractLicense(CONTRACT_LICENSE);
    };

    generateContractAttribution = (): string => {
        return Template.getContractAttribution();
    };

    generateImports = (imports: string[]): string => {
        return Template.newLine() + imports.map((i) => Template.getImport(i)).join(Template.newLine()) + Template.newLine();
    };

    generateContractContent = (contract: IContract): string => {
        // Content inside the contract declaration
        const contractContent = [
            this.generateLibraries(contract.getLibraries()),
            this.generateVariables(contract.getVariables()),
            this.generateConstructor(contract),
            this.generateMethods(contract.getMethods())
        ];

        return (
            Template.newLine() +
            Template.getContractStarter(contract.getName(), contract.getFinalExtensions()) +
            Template.getContractContent(contractContent.join(''))
        );
    };

    generateConstructor = (contract: IContract): string => {
        return Template.newLine() + Template.getConstructor(contract.getName(), contract.getSymbol(), contract.getConstructorContent());
    };

    generateLibraries = (libraries: IContractLibrary[]): string => {
        return Template.arrayWrapper(libraries, libraries.map((lib) => Template.getLibrary(lib)).join(''));
    };

    generateVariables = (variables: IContractVariable[]): string => {
        const varsContent = variables.map((v) => this.generateVariable(v)).join(Template.newLine());

        return Template.arrayWrapper(variables, Template.newLine() + varsContent);
    };

    generateVariable = (variable: IContractVariable): string => {
        return Template.getGlobalVariable(variable);
    };

    generateMethods = (methods: IContractMethod[]): string => {
        const methodsStrings = methods.map((method) => this.generateMethod(method));

        let prevIsRequired = false;

        for (let i = 0; i < methods.length; i++) {
            if (methods[i].solidityRequired && !prevIsRequired) {
                methodsStrings.splice(i, 0, Template.getRequiredOverridesMessage());
                prevIsRequired = true;
            }
        }

        return Template.arrayWrapper(methods, methodsStrings.join(Template.newLine()));
    };

    generateMethod = (method: IContractMethod): string => {
        const params = method.params.map((param) => `${param.type} ${param.name}`).join(', ');

        return (
            Template.newLine() +
            Template.getFunctionStarter(method.name, params) +
            Template.getFunctionDetails([method.visibility, method.options, method.stateMutability]) +
            Template.getFunctionOverrides(method.overrides) +
            Template.getFunctionReturnType(method.returns) +
            Template.getFunctionContent(method.content)
        );
    };

    replaceUserInputs = (strContract: string, inputs: IArguments): string => {
        // Return if nothing to replace
        if (Object.keys(inputs).length === 0) return strContract;
        // Create the string regex with all the values to change
        const strRegexExp = Object.keys(inputs)
            .map((key) => `%${key}%`)
            .join('|');
        // Create the expression - global + case insensitive options
        const regex = new RegExp(strRegexExp, 'gi');
        console.log(regex);
        // Replace the inputs and return the final string
        return strContract.replace(regex, (matched: string) => inputs[matched.slice(1, -1)] ?? matched);
    };
}

export default TemplateService;
