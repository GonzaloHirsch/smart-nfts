import solc from 'solc';
import fs from 'fs';
import path from 'path';

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
    console.log(output);
    // `output` here contains the JSON output as specified in the documentation
    for (const contractName in output.contracts[CONTRACT_NAME]) {
      fs.writeFile('/tmp/test-bytecode.json', output.contracts[CONTRACT_NAME][contractName].evm.bytecode.object, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('The bytecode was saved!');
      });
      fs.writeFile('/tmp/test-abi.json', JSON.stringify(output.contracts[CONTRACT_NAME][contractName].abi), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('The abi was saved!');
      });
    }
    return '';
  }
};