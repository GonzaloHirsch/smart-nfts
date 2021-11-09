
class ExampleService {

    private static instance: ExampleService;

    constructor() {}

    static getInstance = () => {

        if (!ExampleService.instance) {
            ExampleService.instance = new ExampleService();
        }
        return ExampleService.instance;
    }

    exampleMethod = async (parameter : string[]) : Promise<number> => {

        const declareExample : number = 2;
		// Se puede no especificar pero declaremos para consistencia
		const declareExample2 = 2;
		return declareExample;
    };
}

export default ExampleService;
