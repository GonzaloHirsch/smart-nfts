import { EXTENSIONS } from "../constants/contract.constants";
import { IContractLibrary, IContractVariable } from "../interfaces/contract.interface";

export const newLine = (): string => {
    return '\n';
}

export const indexContent = (content: string): string => {
    return `\t${content}`;
}

export const arrayWrapper = (array: any[], defaultContent: string): string => {
    return array.length == 0
        ? ''
        : defaultContent;
}

//**********************************//
//*********CONTRACT TEMPLATE********//
//**********************************//

export const getSolidityVersion = (version: string): string => {
    return `pragma solidity ^${version}` + newLine();
}

export const getContractStarter = (name: string, extensions: EXTENSIONS[]): string => {
    return `contract ${name} is ${extensions.join(', ')}` + newLine();
}

export const getContractContent = (content: string): string => {
    const indexedContent = content
        .split(newLine())
        .map(line => indexContent(line))
        .join(newLine());

    return `{` + newLine() + indexedContent + newLine() + `}`;
}

export const getConstructor = (name: string, symbol: string): string => {
    return `constructor() ERC721("${name}", "${symbol}") {}`+ newLine();
}

export const getLibrary = (library: IContractLibrary): string => {
    return `using ${library.name} for ${library.for};` + newLine();
}

export const getImport = (imp: string): string => {
    return `import ${imp};` + newLine();
}

//**********************************//
//*****GLOBAL VARIABLE TEMPLATE*****//
//**********************************//

export const getGlobalVariable = (variable: IContractVariable): string => {
    return `${variable.type} ${variable.visibility} ${variable.name};` + newLine();
}

//**********************************//
//********FUNCTION TEMPLATES********//
//**********************************//

const getNullableDetail = (detail?: string): string => {
    return detail != null 
        ? `${indexContent(detail)}` + newLine()
        : '';
}

export const getFunctionStarter = (name: string, params: string): string => {
    return `function ${name}(${params})` + newLine();
}

export const getFunctionDetails = (details: (string | undefined)[]): string => {
    return details.map(detail => getNullableDetail(detail)).join('');
}

export const getFunctionContent = (content: string[]): string => {
    return `{` + newLine() +
        content.map(line => indexContent(line)).join('') +
        `}`;
}