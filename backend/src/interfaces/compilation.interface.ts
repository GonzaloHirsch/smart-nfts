// Interface for the input the compiler expects
interface ICompilerInfo {
    language: string;
    sources: any;
    settings: {
      outputSelection: any;
    };
}
  
interface ICompilerResponse {
    abi: any;
    bytecode: string;
    compilerVersion: string;
}