
import express, { Application } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import ErrorHandlerMiddleware from './middlewares/errorHandler.middleware';

import * as dotenv from "dotenv";
import Helmet from "helmet";
import { HealthRoutes } from './routes/health.routes';

import rateLimit from 'express-rate-limit';


class App {
	public app: Application;
	
	constructor() {

		this.app = express();
		
		this.setConfig();

		this.routes();
		
		this.initializeErrorHandling();
	}
	
	private setConfig() {

		dotenv.config();
		
		this.app.use(Helmet());
		this.app.use(bodyParser.json({ limit: '50mb' }));
		this.app.use(bodyParser.urlencoded({ limit: '50mb', extended:true}));
		// this.app.use(cors());
		// this.app.set('trust proxy', 1);
		
		const limiter = rateLimit({
			windowMs: 5 * 60 * 1000, // 15 minutes
			max: 100 // limit each IP to 100 requests per windowMs
		  });

		this.app.use(limiter);
	}
	
	private initializeErrorHandling() {
		this.app.use(ErrorHandlerMiddleware);
	}
		
	private routes(){

		this.app.use('/', new HealthRoutes().router);

	}
	
	
}

export default new App().app;
