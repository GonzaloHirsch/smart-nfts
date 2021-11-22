import {RequestHandler} from 'express';
import fs from 'fs';
import { EXTENSIONS } from '../constants/contract.constants';
import { CustomContract } from '../contracts/custom.contract';
import { ERC721 } from '../contracts/ERC721.contract';
import TemplateService from '../services/template.service';

export class ContractController {

    public start: RequestHandler = async (req, res, next) => {

        const c = new CustomContract(
            ERC721.getExtensionOZImports(),
            'MyToken',
            'PF',
            [EXTENSIONS.ERC721],
            ERC721.getExtensionLibs(),
            ERC721.getExtensionVariables(),
            ERC721.getExtensionMethods()
        );

        const cString = TemplateService.getInstance().generateContract(c);

        fs.writeFile("/tmp/test", cString, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

        res.status(200).send({contract: cString}); 
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