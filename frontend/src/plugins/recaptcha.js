import { inject } from 'vue';

// Constant plugin key
const PLUGIN_KEY = 'recaptcha-plugin';

const recaptcha = {
    challengeInput: async (action, apiInstance, nextFunction) => {
        grecaptcha.ready(async () => {
            const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
            const token = await grecaptcha.execute(recaptchaKey, { action: action });
            apiInstance.verifyRecaptchaToken(token).then((res) => {
                nextFunction(res);
            });
        });
    }
}

// Method to inject API in any setup component
export const useRecaptcha = () => {
    return inject(PLUGIN_KEY);
}

// Exporting install and other stuff
export const recaptchaPlugin = {
    install: (app, options) => {
        // Provide the plugin
        app.provide(PLUGIN_KEY, recaptcha)
    }
};

