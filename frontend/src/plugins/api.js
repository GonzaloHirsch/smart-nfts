import { inject } from 'vue';
import axios from 'axios';

// Constant plugin key
const PLUGIN_KEY = 'pf-api';

// Axios instance
let instance;

const api = {
    healthCheck: () => {
        instance.get('contracts/example').then(res => {
            console.log(res);
        })
    },
    loadContract: async () => {
        return instance.get('contracts/example').then(res => {
            return res.data.contract;
        })
    },
    editContract: async (contractId, data) => {
        return instance.put(`contracts/${contractId}`, data).then(res => {
            return res
        })
    },
    getContract: async (contractId) => {
        return instance.get(`contracts/${contractId}`).then(res => {
            return res
        })
    },
    createContract: async () => {
        return instance.post(`contracts`).then(res => {
            return res
        })
    },
    deployContract: async (contractId) => {
        return instance.post(`contracts/${contractId}/deploy`).then(res => {
            return res
        })
    },
    verifyContract: async (contractId) => {
        return instance.post(`contracts/${contractId}/verify`).then(res => {
            return res
        })
    },
}

// Method to inject API in any setup component
export const useApi = () => {
    return inject(PLUGIN_KEY);
}

// Exporting install and other stuff
export const apiPlugin = {
    install: (app, options) => {
        // Create axios instance
        instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL
        });
        // Provide the plugin
        app.provide(PLUGIN_KEY, api)
    }
};