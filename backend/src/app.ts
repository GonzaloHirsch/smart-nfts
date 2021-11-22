
import express, { Application } from 'express';
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';

// Custom middlewares;
import ErrorHandlerMiddleware from './middlewares/errorHandler.middleware';

// Routes
import { HealthRoutes } from './routes/health.routes';
import { ContractRoutes } from './routes/contract.routes';


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
		// Helps you secure app by setting various HTTP headers
		this.app.use(helmet());
		// Recognize the incoming Request Object as a JSON Object
		this.app.use(express.json({ limit: '50mb' }));
		// Recognize the incoming Request Object as strings or arrays
		this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
		
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
		this.app.use('/contract', new ContractRoutes().router);

	}
	
}

export default new App().app;
