import { IContract, IContractMethod } from "../interfaces/contract.interface";
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
        return Template.getImports(contract.getImports()) +
            Template.getContractStarter(contract.getName(), contract.getExtensions()) +
            Template.getLibraries(contract.getLibraries());
    }

    generateMethod = (method: IContractMethod): string => {
        const params = Object.values(method.params)
            .map(param => `${param.type} ${param.name}`)
            .join(', ');
        
        return Template.newLine() +
            Template.getFunctionStarter(method.name, params) +
            Template.getFunctionDetails([method.visibility, method.options, method.stateMutability]) +
            Template.getFunctionContent(method.content) +
            Template.newLine();
    }


}

export default TemplateService;
