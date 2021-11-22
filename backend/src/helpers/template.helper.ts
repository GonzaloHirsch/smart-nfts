import { EXTENSIONS } from "../constants/extension.constants";
import { IContractLibrary } from "../interfaces/contract.interface";

export const newLine = (): string => {
    return '\n';
}

export const indexContent = (content: string): string => {
    return `\t${content}`;
}

const spacingWrapper = (content: string): string => {
    return newLine() + content + newLine();
}

//**********************************//
//*********CONTRACT TEMPLATE********//
//**********************************//

export const getImports = (imports: string[]): string => {
    return spacingWrapper(imports.join(newLine()));
}

export const getContractStarter = (name: string, extensions: EXTENSIONS[]): string => {
    return spacingWrapper(
        `contract ${name} is ${extensions.join(', ')}`
    );
}

export const getConstructor = (name: string, symbol: string): string => {
    return spacingWrapper( 
        `constructor() ERC721("${name}", "${symbol}") {}`
    );
}

export const getLibraries = (libraries: IContractLibrary[]): string => {
    return Object.values(libraries)
        .map(lib => `using ${lib.name} for ${lib.for}`)
        .join(newLine())
}

//**********************************//
//*****GLOBAL VARIABLE TEMPLATE*****//
//**********************************//

//**********************************//
//********FUNCTION TEMPLATES********//
//**********************************//

const getNullableDetail = (detail?: string): string => {
    return detail != null 
        ? `${indexContent(detail)}` + newLine()
        : '';
}

export const getFunctionStarter = (name: string, params: string): string => {
    return spacingWrapper(
        `function ${name}(${params})`
    );
}

export const getFunctionDetails = (details: (string | undefined)[]): string => {
    return details.map(detail => getNullableDetail(detail)).join('');
}

export const getFunctionContent = (content: string[]): string => {
    return `{` + newLine() +
        content.map(line => indexContent(line)).join('') +
        `}`;
}