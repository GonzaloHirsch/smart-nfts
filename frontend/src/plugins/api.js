import { inject } from 'vue';
import axios from 'axios';
import fileDownload from 'js-file-download';
import {PAGINATION_PER_PAGE} from '../js/constants';

// Constant plugin key
const PLUGIN_KEY = 'pf-api';

// Axios instance
let instance;

const api = {
    getStatus: async () => {
        return instance.get('').then(res => {
            return res
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
    getTokens: async (contractId, page = 1) => {
        return instance.get(`contracts/${contractId}/tokens?page=${page}&perPage=${PAGINATION_PER_PAGE}`).then(res => {
            return res;
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
        });
    },
    downloadContract: async (contractId) => {
        return instance.get(`contracts/${contractId}/contents`, { responseType: 'blob' }).then(res => {
            const filename = res.headers['content-disposition'].split('filename=')[1];
            fileDownload(res.data, filename);
            return res;
        });
    },
    interactWithContract: async (contractId, methodId, inputs) => {
        return instance.post(`contracts/${contractId}/interact`, {
            methodId: methodId,
            inputs: inputs
        }).then(res => {
            return res;
        });
    },
    mintWithContract: async (contractId, formData) => {
        return instance.post(`contracts/${contractId}/mint`, formData, {
            "Content-Type": "multipart/form-data"
        }).then(res => {
            return res;
        });
    },
    verifyRecaptchaToken: async (token) => {
        return instance.post(`security/verify`, {
            token: token
        }).then(res => {
            return res;
        });
    },
    sendEmailReminder: async (contractId, email) => {
        return instance.post(`contracts/${contractId}/reminder`, {
            email: email
        }).then(res => {
            return res;
        });
    }
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