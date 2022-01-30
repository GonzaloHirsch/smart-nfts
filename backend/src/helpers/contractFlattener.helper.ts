// Adapted from https://github.com/Aniket-Engg/sol-straightener#readme
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { getInstalledPath } from 'get-installed-path';

const regEx = {
    pragma: /(pragma solidity (.+?);)/g,
    import: /import ['"](.+?)['"];/g,
    github: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)\/(.*)/
};

let processedFiles: Array<string> = [];

const getNodeModulesFolders = async (dir: string) => {
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

    const rootNodeModules = (await execSync('npm root', { cwd: dir })).toString().trim();

    return [...folders.reverse(), rootNodeModules];
};

const getNodeModulePath = async (name: string, { cwd }: any) => {
    return getInstalledPath(name, {
        paths: await getNodeModulesFolders(cwd),
        cwd
    });
};

const processFile = async (file: string, fromGithub: boolean, root = false, hasContents = false, fileContents: string | undefined) => {
    try {
        if (root) processedFiles = [];

        if (processedFiles.indexOf(file) !== -1) return;

        processedFiles.push(file);
        let result = '';
        let contents;
        let imports;

        // If file from Github, make the API calls
        if (fromGithub) {
            const metadata = regEx.github.exec(file);
            if (metadata === undefined || metadata === null || metadata.length < 5) throw 'Insufficiente metadata from Github';
            const url = 'https://api.github.com/repos/' + metadata[3] + '/contents/' + metadata[4];
            axios.defaults.headers.post['User-Agent'] = 'sol-straightener';
            contents = Buffer.from((await axios.get(url)).data.content, 'base64').toString();
            contents = contents.replace(regEx.pragma, '').trim();
            imports = await processImports(file, contents, path.dirname(metadata[0]));
        } else {
            // Read the file contents
            if (!hasContents) contents = fs.readFileSync(file, { encoding: 'utf-8' });
            else contents = fileContents!;
            // Remove the pragma part
            contents = contents.replace(regEx.pragma, '').trim();
            imports = await processImports(file, contents);
        }
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

const processImports = async (file: string, content: string, githubPrefix: string | undefined = undefined) => {
    try {
        let group = null;
        const result = [];
        let fileContents;
        regEx.import.exec(''); // Resetting state of RegEx
        while ((group = regEx.import.exec(content))) {
            let importFile = group[1];
            if (githubPrefix) importFile = path.join(githubPrefix, importFile); // for imports in github file

            // File from Github
            if (importFile.substring(0, 10) == 'github.com') {
                fileContents = await processFile(importFile, true, false, false, undefined);
            } else {
                // Get path to file to know where it is
                let filePath = path.join(path.dirname(file), importFile);
                if (!fs.existsSync(filePath)) {
                    const nodeModulesPath = await getNodeModulePath(path.dirname(importFile), { cwd: path.dirname(file) });
                    filePath = path.join(nodeModulesPath, path.basename(importFile));
                }
                filePath = path.normalize(filePath);
                fileContents = await processFile(filePath, false, false, false, undefined);
            }
            if (fileContents) {
                result.push(fileContents);
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
    let contractSource = await processFile(filePath, false, true, false, undefined);
    contractSource = pragma + '\n\n' + contractSource;
    return contractSource;
};

export const straightenContent = async (fileContent: string): Promise<string> => {
    const pragma = getPragmaFromContent(fileContent);
    // Give it a fake name
    let contractSource = await processFile('./contract.sol', false, true, true, fileContent);
    contractSource = pragma + '\n\n' + contractSource;
    return contractSource;
};
