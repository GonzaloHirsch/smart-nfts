// Adapted from https://github.com/Aniket-Engg/sol-straightener#readme
import path from 'path';
import fs from 'fs';
import { getInstalledPath } from 'get-installed-path';

const regEx = {
    pragma: /(pragma solidity (.+?);)/g,
    import: /import ['"](.+?)['"];/g
};

let processedFiles: {[key: string]: boolean} = {};
let rootNodeModules = process.env.NODE_MODULES_PATH!;

const getNodeModulesFolders = (dir: string) => {
    const parts = path.dirname(dir).split(path.sep);
    const folders: Array<string> = [];
    for (let partIdx = 0; partIdx < parts.length; partIdx++) {
        const part = parts[partIdx];

        if (folders.length === 0) {
            folders.push(path.join(path.sep, part, 'node_modules'));
        } else {
            folders.push(path.join(path.dirname(folders[partIdx - 1]), part, 'node_modules'));
        }
    }

    return [...folders.reverse(), rootNodeModules];
};

const getNodeModulePath = async (name: string, { cwd }: any) => {
    return getInstalledPath(name, {
        paths: getNodeModulesFolders(cwd),
        cwd
    });
};

const processFile = async (file: string, root = false, hasContents = false, fileContents: string | undefined) => {
    try {
        // Makes sure not to process twice
        if (root) processedFiles = {};
        if (file in processedFiles) return;

        processedFiles[file] = true;
        let result = '';
        let contents;
        let imports;

        // Read the file contents if not given
        if (!hasContents) contents = fs.readFileSync(file, { encoding: 'utf-8' });
        else contents = fileContents!;
        // Remove the pragma part
        contents = contents.replace(regEx.pragma, '').trim();
        imports = await processImports(file, contents);
        for (let i = 0; i < imports.length; i++) {
            result += imports[i] + '\n\n';
        }
        contents = contents.replace(regEx.import, '').trim();
        result += contents;
        return result;
    } catch (error) {
        throw error;
    }
};

const processImports = async (file: string, content: string) => {
    try {
        let group = null;
        const result = [];
        let fileContents;
        regEx.import.exec(''); // Resetting state of RegEx
        while ((group = regEx.import.exec(content))) {
            let importFile = group[1];

            // Get path to file to know where it is
            let filePath = path.join(path.dirname(file), importFile);

            if (!(filePath in processedFiles)) {
                processedFiles[filePath] = true;
                // Instead of checking for the file to exist, we make sure that it does not have the entire path to it
                if (!filePath.includes(rootNodeModules)) {
                    const nodeModulesPath = await getNodeModulePath(path.dirname(importFile), { cwd: path.dirname(file) });
                    filePath = path.join(nodeModulesPath, path.basename(importFile));
                }
                filePath = path.normalize(filePath);
                fileContents = await processFile(filePath, false, false, undefined);
                if (fileContents) {
                    result.push(fileContents);
                }
            }
            
        }
        return result;
    } catch (error) {
        throw error;
    }
};

// PRAGMA
// Gets the solidity version

const getPragma = async (path: string) => {
    const contents = fs.readFileSync(path, { encoding: 'utf-8' });
    const group = regEx.pragma.exec(contents);
    return group && group[1];
};

const getPragmaFromContent = (contents: string) => {
    const group = regEx.pragma.exec(contents);
    return group && group[1];
};

// EXPORTS

export const straighten = async (filePath: string) => {
    const pragma = await getPragma(filePath);
    let contractSource = await processFile(filePath, true, false, undefined);
    contractSource = pragma + '\n\n' + contractSource;
    return contractSource;
};

export const straightenContent = async (fileContent: string): Promise<string> => {
    const pragma = getPragmaFromContent(fileContent);
    // Give it a fake name
    let contractSource = await processFile('./contract.sol', true, true, fileContent);
    contractSource = pragma + '\n\n' + contractSource;
    return contractSource;
};
