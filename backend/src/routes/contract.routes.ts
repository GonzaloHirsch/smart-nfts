import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import {urlencoded} from "body-parser";
import cors from 'cors';

export class ContractRoutes {

    public router: Router = Router();
    public controller : ContractController = new ContractController();

    constructor() {
        this.init();
    }

    public init() {
        
        this.router.use(urlencoded({
            extended: true
        }));

        this.router.use(cors());

        this.router.get('/example', this.controller.example);
        this.router.get('/compile', this.controller.compile);

        this.router.post('/', this.controller.generateContract);
        
        this.router.put('/:contractId', this.controller.editContract);
    }


}