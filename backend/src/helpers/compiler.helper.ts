import solc from 'solc';
import fs from 'fs';
import path from 'path';
import { removeAllButLast } from '../helpers/string.helper';
import { straightenContent } from '../helpers/contractFlattener.helper';
import CompilationException from '../exceptions/compilation.exception';
import { ENVIRONMENTS } from '../constants/general.constants';

// This should never execute, this is to trick webpack into bundling this dependency
if (process.env.node_env !== undefined && process.env.node_env !== ENVIRONMENTS.DEVELOPMENT && process.env.node_env !== ENVIRONMENTS.PRODUCTION) {
  import('@openzeppelin/contracts').then((res) => {
    console.log('Imported OpenZeppelin Contracts...');
  });
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
        throw new CompilationException();
    
    } else {
        // We have only 1 contract to compile, we can just look for the first element
        const contractName = Object.keys(output.contracts[CONTRACT_NAME])[0];
        return {
            bytecode: output.contracts[CONTRACT_NAME][contractName].evm.bytecode.object,
            abi: output.contracts[CONTRACT_NAME][contractName].abi,
            compilerVersion: `v${JSON.parse(output.contracts[CONTRACT_NAME][contractName].metadata).compiler.version}` // add a 'v' that the version is missing
        };
    }
};

export const flattenContract = async (contract: string): Promise<string> => {
    // Flatten and remove extra licenses
    return straightenContent(contract)
        .then((res: any) => removeAllButLast(res, '// SPDX-License-Identifier: MIT'))
        .catch((err: any) => {
            console.log(err);
            return '';
        });
};
