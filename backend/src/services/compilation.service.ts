import { compileContract } from '../helpers/compiler.helper';
import { IStoredContract } from '../models/storedContract.model';

class CompilationService {
    private static instance: CompilationService;

    static getInstance = () => {
        if (!CompilationService.instance) {
            CompilationService.instance = new CompilationService();
        }
        return CompilationService.instance;
    };

    /**
     * Given the stored contract and its string content, compile the contract content
     * Save the state of the contract in local db.
     * @param contract Contract info that is stored in the our own db
     * @param contractString Content of the contract that must be compiled
     */
    public compileContract = async (contract: IStoredContract, contractString: string): Promise<IStoredContract> => {
        console.log(`Started compilation of contract ${contract.id}`);

        // Compile contract
        const compiledContract = compileContract(contractString);

        console.log(`Compiled contract ${contract.id}`);

        // Update inner state
        contract.compilation = {
            digest: contract.digest,
            abi: compiledContract.abi,
            bytecode: compiledContract.bytecode,
            compilerVersion: compiledContract.compilerVersion,
            date: new Date(),
            extensions: contract.extensions,
            inputs: contract.inputs
        };
        contract.markModified('compilation.abi');
        contract.markModified('compilation.inputs');
        contract.markModified('compilation.extensions');
        contract.markModified('compilation');
        await contract.save();

        return contract;
    };
}

export default CompilationService;
