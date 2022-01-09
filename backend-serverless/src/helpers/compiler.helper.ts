import solc from 'solc';
import fs from 'fs';
import path from 'path';

// This should never execute, this is to trick webpack into bundling this dependency
if (process.env.node_env !== undefined && process.env.node_env !== 'development' && process.env.node_env !== 'production') {
  import("@openzeppelin/contracts").then(res => {
    console.log("Imported OpenZeppelin Contracts...");
  });
}

// Interface for the input the compiler expects
interface ICompilerInfo {
  language: string;
  sources: any;
  settings: {
    outputSelection: any;
  };
}

const CONTRACT_NAME = './ERC721.sol';
const compilerInput: ICompilerInfo = {
  language: 'Solidity',
  sources: {},
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

// Taken from https://issueexplorer.com/issue/ethereum/solc-js/536#781659
const findImports = (_path: string): any => {
  if (_path[0] === '.') {
    return {
        contents: fs.readFileSync(path.join("./", _path)).toString()
    }
  } else {
    return {
        contents: fs.readFileSync(path.join("./", 'node_modules', _path)).toString()
    }
  }
}

export const compileContract = (contract: string): string => {
  // Set the input source as our contract
  const input = compilerInput;
  input.sources[CONTRACT_NAME] = {
    content: contract
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input), {import: findImports}));
  // TODO: devolver bien un error
  if (output.errors && output.errors.length > 0) {
    console.log(output);
    return '';
  } else {
    // `output` here contains the JSON output as specified in the documentation
    console.log(output);
    return '';
  }
};