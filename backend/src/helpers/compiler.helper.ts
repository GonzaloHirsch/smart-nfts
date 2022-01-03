import solc from 'solc';
import fs from 'fs';

// Interface for the input the compiler expects
interface ICompilerInfo {
  language: String;
  sources: any;
  settings: {
    outputSelection: any;
  };
}

const CONTRACT_NAME: string = './ERC721.sol';
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

export const compileContract = (contract: string): string => {
  const sources = {};
  compileImports(contract, CONTRACT_NAME, sources, false);
  let input = compilerInput;
  input.sources = sources;

  var output = JSON.parse(solc.compile(JSON.stringify(input)));
  // TODO: devolver bien un error
  if (output.errors && output.errors.length > 0) {
    console.log(output);
    return '';
  } else {
    console.log(output);
    // `output` here contains the JSON output as specified in the documentation
    for (var contractName in output.contracts[CONTRACT_NAME]) {
      // console.log(contractName + ': ' + output.contracts[CONTRACT_NAME][contractName].evm.bytecode.object);
      // console.log(output.contracts[CONTRACT_NAME][contractName].abi);
      console.log(typeof output.contracts[CONTRACT_NAME][contractName].evm.bytecode.object);
      console.log(typeof output.contracts[CONTRACT_NAME][contractName].abi);
      
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

// Taken from https://ethereum.stackexchange.com/questions/103470/using-solc-to-compile-contract-that-imports-local-openzeppelin-contracts
// returns sources: { "Contract.sol": { content: fs.readFileSync("pathName.sol",utf8)...}}
// using recursion
const compileImports = (contract: string, root: string, sources: any, readFile: boolean) => {
  // Determine if read file from fs or is passed as parameter
  // Initial contract already comes as string, no need to read it
  if (readFile) sources[root] = { content: fs.readFileSync(root, 'utf8') };
  else sources[root] = { content: contract };
  const imports = getNeededImports(sources[root].content, root);
  for (let i = 0; i < imports.length; i++) {
    compileImports('', imports[i], sources, true);
  }
};

// returns all the import paths in absolute path
const getNeededImports = (contract: string, path: string) => {
  const files = new Array();
  contract.split('\n').forEach(function (line: string, index: number, arr: Array<any>) {
    if ((index === arr.length - 1 && line === '') || !line.trim().startsWith('import')) {
      return;
    }
    const relativePath = line.substring(8, line.length - 2);
    const fullPath = buildFullPath(path, relativePath);
    files.push(fullPath);
  });
  return files;
};

// parent: node_modules/.../ERC721/ERC721.sol
// returns absolute path of a relative one using the parent path
const buildFullPath = (parent: string, path: string) => {
  let curDir = parent.substr(0, parent.lastIndexOf('/')); //i.e. ./node/.../ERC721

  if (path.startsWith('./')) {
    return curDir + '/' + path.substr(2);
  }

  while (path.startsWith('../')) {
    curDir = curDir.substr(0, curDir.lastIndexOf('/'));
    path = path.substr(3);
  }

  return curDir + '/' + path;
};
