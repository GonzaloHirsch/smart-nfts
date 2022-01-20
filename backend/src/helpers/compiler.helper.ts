import solc from 'solc';
import fs from 'fs';
import path from 'path';
import Straightener from 'sol-straightener';
import { removeAllButLast } from '../helpers/string.helper';
import { straightenContent } from '../helpers/contractFlattener.helper';

// This should never execute, this is to trick webpack into bundling this dependency
if (process.env.node_env !== undefined && process.env.node_env !== 'development' && process.env.node_env !== 'production') {
  import('@openzeppelin/contracts').then((res) => {
    console.log('Imported OpenZeppelin Contracts...');
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

interface ICompilerResponse {
  abi: any;
  bytecode: string;
  compilerVersion: string;
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
      contents: fs.readFileSync(path.join('./', _path)).toString()
    };
  } else {
    return {
      contents: fs.readFileSync(path.join('./', 'node_modules', _path)).toString()
    };
  }
};

export const compileContract = (contract: string): ICompilerResponse => {
  // Set the input source as our contract
  const input = compilerInput;
  input.sources[CONTRACT_NAME] = {
    content: contract
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  if (output.errors && output.errors.length > 0) {
    console.log(output.errors);
    throw 'Contract contains errors!';
  } else {
    // We have only 1 contract to compile, we can just look for the first element
    const contractName = Object.keys(output.contracts[CONTRACT_NAME])[0];
    // console.log(output.contracts[CONTRACT_NAME][contractName])
    return {
      bytecode: output.contracts[CONTRACT_NAME][contractName].evm.bytecode.object,
      abi: output.contracts[CONTRACT_NAME][contractName].abi,
      compilerVersion: `v${JSON.parse(output.contracts[CONTRACT_NAME][contractName].metadata).compiler.version}` // add a 'v' that the version is missing
    };
  }
};

export const flattenContract = async (contract: string): Promise<string> => {
  // Flatten and remove extra licenses
  return await straightenContent(contract)
    .then((res: any) => removeAllButLast(res, '// SPDX-License-Identifier: MIT'))
    .catch((err: any) => {
      console.log(err);
      return '';
    });
};
