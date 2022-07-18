import { inject } from 'vue';
import axios from 'axios';
import fileDownload from 'js-file-download';
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
        const headers = getSecurityHeaders(recaptcha);
        headers['Content-Type'] = 'application/octet-stream';
        return instance.get(`contracts/${contractId}/contents`, { responseType: 'blob', headers: headers }).then(res => {
            const filename = res.headers['content-disposition'].split('filename=')[1];
            // Convert to proper blob
            // const byteCharacters = atob(res.data);
            // const byteNumbers = new Array(byteCharacters.length);
            // for (let i = 0; i < byteCharacters.length; i++) {
            //     byteNumbers[i] = byteCharacters.charCodeAt(i);
            // }
            // const byteArray = new Uint8Array(byteNumbers);
            // const blob = new Blob(
            //     [res.data],
            //     {
            //         type: 'application/octet-stream'
            //     }
            // );
            // fileDownload(res.data, filename);
            const blob = new Blob([res.data]);

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.target = '_blank';
            link.setAttribute("type", "hidden");

            // This is needed for firefox
            document.body.appendChild(link);

            link.click();
            link.remove();
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