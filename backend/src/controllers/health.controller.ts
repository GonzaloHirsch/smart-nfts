import {RequestHandler} from 'express';

export class HealthController{

    public start: RequestHandler = async (req, res, next) => {
        res.status(200).send({message: "Bienvenido a Proyecto Final. Por Gonzalo Hirsch y Florencia Petrikovich :)"}); 
    }

}