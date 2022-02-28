import { inject } from 'vue';

// Constant plugin key
const PLUGIN_KEY = 'recaptcha-plugin';

const recaptcha = {
    challengeInput: async (action, callback) => {
        if (!(window.grecaptcha)) {
            console.error("Recaptcha hasn't loaded yet!")
        }
        else {
            window.grecaptcha.ready(async () => {
                const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
                const token = await window.grecaptcha.execute(recaptchaKey, { action: action });
                callback(token);
            });
        }
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

