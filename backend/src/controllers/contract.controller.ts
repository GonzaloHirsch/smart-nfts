import {RequestHandler} from 'express';
import fs from 'fs';
import { EXTENSIONS } from '../constants/contract.constants';
import { CustomContract } from '../contracts/custom.contract';
import { ERC721 } from '../contracts/ERC721.contract';
import { Pausable } from '../contracts/Pausable.contract';
import { Correct } from '../contracts/Correct.contract';
import { compileContract } from '../helpers/compiler.helper';
import TemplateService from '../services/template.service';

export class ContractController {

    public example: RequestHandler = async (req, res, next) => {

        const contract = new CustomContract(
            Pausable.getExtensionOZImports(),
            'MyToken',
            'PF',
            [EXTENSIONS.PAUSABLE],
            Pausable.getExtensionLibs(),
            Pausable.getExtensionVariables(),
            Pausable.getExtensionMethods()
        );

        const contractString = TemplateService.getInstance().generateContract(contract);

        fs.writeFile("/tmp/test", contractString, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

        res.status(200).send({contract: contractString}); 
    }
    
    public compile: RequestHandler = async (req, res, next) => {
        const contract = new CustomContract(
            Correct.getExtensionOZImports(),
            'MyToken',
            'PF',
            [EXTENSIONS.CORRECT],
            Correct.getExtensionLibs(),
            Correct.getExtensionVariables(),
            Correct.getExtensionMethods()
        );
        
        const contractString = TemplateService.getInstance().generateContract(contract);
        compileContract(contractString);
        
        res.status(200).send({contract: contractString}); 
    }

    public getContractById: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Got the contract"}); 
    }

    public getCustomisationOptions: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }

    public createContract: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }

    public deployContract: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }

    public interactWithContract: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }
}