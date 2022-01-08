import {RequestHandler} from 'express';
import fs from 'fs';
import { EXTENSIONS } from '../constants/contract.constants';
import { CustomContract } from '../contracts/custom.contract';
import { ERC721 } from '../contracts/ERC721.contract';
import { Pausable } from '../contracts/Pausable.contract';
import { Correct } from '../contracts/Correct.contract';
import { compileContract } from '../helpers/compiler.helper';
import TemplateService from '../services/template.service';
import HttpExection from '../exceptions/http.exception';
import CreationService from '../services/creation.service';
import { enumHasKeys } from '../helpers/collection.helper';
import GenericException from '../exceptions/generic.exception';

export class ContractController {

    private creationService: CreationService;

    constructor() {
        this.creationService = CreationService.getInstance();
    }

    public example: RequestHandler = async (req, res, next) => {

        const contract = new CustomContract(
            Pausable.getExtensionOZImports(),
            'MyToken',
            'PF',
            [EXTENSIONS.Pausable],
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

    public generateContract: RequestHandler = async (req, res, next) => {
        const name = req.body.name as string;
        const symbol = req.body.symbol as string; 
        const extensions = req.body.extensions as string[]; 

        console.log(extensions);

        if (!name || !symbol || !extensions || !enumHasKeys(EXTENSIONS, extensions)) {
            // TODO error handling
            next(new GenericException({internalStatus: '', status: 400, message: 'bad params'}))
            return;
        }

        try {

            res.status(200).send({contract: this.creationService.genContract(name, symbol, extensions as EXTENSIONS[])});

        } catch (err) {
            next(err);
        }
    
    }
    
    public editContract: RequestHandler = async (req, res, next) => {
        if (req.params.contractId.trim().length === 0) {
            throw new HttpExection(400, 'BadRequest', 'Invalid contract id');
        }
        console.log(req.params.contractId)
        console.log(req.body);
        
        const contract = new CustomContract(
            Pausable.getExtensionOZImports(),
            'MyToken',
            'PF',
            [EXTENSIONS.Pausable],
            Pausable.getExtensionLibs(),
            Pausable.getExtensionVariables(),
            Pausable.getExtensionMethods()
        );

        const contractString = TemplateService.getInstance().generateContract(contract);

        res.status(200).send({contract: contractString}); 
    }

    public deployContract: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }

    public interactWithContract: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }
}