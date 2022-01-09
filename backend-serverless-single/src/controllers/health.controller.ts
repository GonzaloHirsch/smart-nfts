import {RequestHandler} from 'express';

export class HealthController{

    public start: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "All services up and running! Welcome to Proyecto Final, a project by Gonzalo Hirsch and Florencia Petrikovich :)"}); 
    }

}