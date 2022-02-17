import { inject } from 'vue';
import axios from 'axios';

// Constant plugin key
const PLUGIN_KEY = 'pf-ipfs';

// Axios instance
let instance;

const ipfs = {
    getJSONContent: async (hash) => {
        return instance.get(hash).then(res => {
            return res;
        })
    },
    getImageContent: async (hash) => {
        return instance.get(hash, {
            responseType: 'blob'
        }).then(res => {
            return res;
        })
    },
    getImageUri: (hash) => {
        return `https://ipfs.io/ipfs/${hash}`
        // return `https://infura-ipfs.io/ipfs/${hash}`
    },
    clearGateUri: (hash) => {
        return hash.replace('ipfs://', '');
    }
}

// Method to inject API in any setup component
export const useIpfs = () => {
    return inject(PLUGIN_KEY);
}

// Exporting install and other stuff
export const ipfsPlugin = {
    install: (app, options) => {
        // Create axios instance
        instance = axios.create({
            baseURL: 'https://ipfs.io/ipfs/'
        });
        // Provide the plugin
        app.provide(PLUGIN_KEY, ipfs)
    }
};