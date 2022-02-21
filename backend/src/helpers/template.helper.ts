import { EXTENSIONS, FINAL_EXTENSIONS } from "../constants/contract.constants";
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


export const getRequiredOverridesMessage = (): string => {
    return newLine() + '// The following functions are overrides required by Solidity.';
}

export const getSolidityVersion = (version: string): string => {
    return `pragma solidity ^${version};` + newLine();
}

export const getContractLicense = (license: string): string => {
    return `// SPDX-License-Identifier: ${license}` + newLine();
}

export const getContractAttribution = (): string => {
    return `// Contract created with Smart NFTs: https://smart-nfts.gonzalohirsch.com/` + newLine();
}

export const getContractStarter = (name: string, extensions: FINAL_EXTENSIONS[]): string => {
    const filteredExtensions = extensions.filter(ext => ext !== FINAL_EXTENSIONS.ERC721);
    return `contract ${name} is ERC721${filteredExtensions.length > 0 ? ',' : ''} ${filteredExtensions.join(', ')}` + newLine();
}

export const getContractContent = (content: string): string => {
    const indexedContent = content
        .split(newLine())
        .map(line => indexContent(line))
        .join(newLine());

    return `{` + newLine() + indexedContent + newLine() + `}`;
}

export const getConstructor = (name: string, symbol: string, content: string[]): string => {
    const strContent = content.length > 0 ? `\n${indexContent(content.join('\n'))}\n`: '';
    return `constructor() ERC721("${name}", "${symbol}") {${strContent}}`+ newLine();
}

export const getLibrary = (library: IContractLibrary): string => {
    return `using ${library.name} for ${library.for};` + newLine();
}

export const getImport = (imp: string): string => {
    return `import "${imp}";`;
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
    return detail != null && detail !== ''
        ? `${indexContent(detail)}` + newLine()
        : '';
}

export const getFunctionStarter = (name: string, params: string): string => {
    return `function ${name}(${params})` + newLine();
}

export const getFunctionDetails = (details: (string | undefined)[]): string => {
    return details.map(detail => getNullableDetail(detail)).join('');
}

export const getFunctionOverrides = (overrides?: EXTENSIONS[]): string => {
    if (overrides == null) {
        return '';
    }
    const overrideString = overrides.length > 0 
        ? `(${overrides.join(', ')})`
        : '';
    return indexContent(`override${overrideString}\n`);
}

export const getFunctionReturnType = (returns?: string): string => {
    return returns != null
        ? indexContent(`returns (${returns})\n`)
        : '';
}

export const getFunctionContent = (content: string[]): string => {
    return `{` + newLine() +
        content.map(line => indexContent(line)).join('') +
        `}`;
}