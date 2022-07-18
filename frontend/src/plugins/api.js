import { inject } from 'vue';
import axios from 'axios';
import { PAGINATION_PER_PAGE } from '../js/constants';

// Constant plugin key
const PLUGIN_KEY = 'pf-api';

const TOKEN_HEADER = 'X-Recaptcha-Token';

// Axios instance
let instance;

const getSecurityHeaders = (recaptcha) => {
    const h = {}
    h[TOKEN_HEADER] = recaptcha;
    return h;
};

const _editContract = async (contractId, data, recaptcha, updateType = 'CONTRACT') => {
    return instance.put(`contracts/${contractId}?updateType=${updateType}`, data, { headers: getSecurityHeaders(recaptcha) }).then(res => {
        return res
    })
};

const api = {
    getStatus: async () => {
        return instance.get('').then(res => {
            return res
        })
    },
    editContractData: async (contractId, data, recaptcha) => {
        return _editContract(contractId, data, recaptcha, "CONTRACT");
    },
    editContractMetadata: async (contractId, data, recaptcha) => {
        return _editContract(contractId, data, recaptcha, "METADATA");
    },
    getContract: async (contractId, recaptcha) => {
        return instance.get(`contracts/${contractId}`, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res
        })
    },
    getTokens: async (contractId, page = 1, recaptcha) => {
        return instance.get(`contracts/${contractId}/tokens?page=${page}&perPage=${PAGINATION_PER_PAGE}`, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res;
        })
    },
    createContract: async (recaptcha) => {
        return instance.post(`contracts`, {}, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res
        })
    },
    deployContract: async (contractId, recaptcha) => {
        return instance.post(`contracts/${contractId}/deploy`, {}, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res
        })
    },
    compileContract: async (contractId, recaptcha) => {
        return instance.post(`contracts/${contractId}/compile`, {}, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res
        })
    },
    verifyContract: async (contractId, recaptcha) => {
        return instance.post(`contracts/${contractId}/verify`, {}, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res
        });
    },
    downloadContract: async (contractId, recaptcha) => {
        return instance.get(`contracts/${contractId}/contents`, { responseType: 'blob', headers: getSecurityHeaders(recaptcha) }).then(async res => {
            const filename = res.headers['content-disposition'].split('filename=')[1];
            
            // Get response text
            let response = await new Response(res.data).text();

            // Creating the a element
            const element = document.createElement('a');
            element.download = filename;
            element.target = '_blank';
            element.setAttribute("type", "hidden");

            // Attempt to decode from base64
            try {
                // Scenario when the content is base64, API production returns base64 string
                window.atob(response);
                element.href = 'data:application/zip;base64,' + response;
            } catch {
                // Scenario when the content is not base64, API locally returns not a base64 string
                console.error("Content from response is not in base64")
                console.error(res.data)
                element.href = URL.createObjectURL(res.data);
            }
            
            // Append, click and remove
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            return res;
        });
    },
    interactWithContract: async (contractId, methodId, inputs, recaptcha) => {
        return instance.post(`contracts/${contractId}/interact`, {
            methodId: methodId,
            inputs: inputs
        }, { headers: getSecurityHeaders(recaptcha) }).then(res => {
            return res;
        });
    },
    mintWithContract: async (contractId, formData, recaptcha) => {
        const headers = { headers: getSecurityHeaders(recaptcha) }
        headers.headers["Content-Type"] = "multipart/form-data";
        headers["Content-Type"] = "multipart/form-data";
        return instance.post(`contracts/${contractId}/mint`, formData, headers).then(res => {
            return res;
        });
    },
    sendEmailReminder: async (contractId, email, recaptcha) => {
        return instance.post(`contracts/${contractId}/reminder`, {
            email: email
        }, { headers: getSecurityHeaders(recaptcha) }).then(res => {
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