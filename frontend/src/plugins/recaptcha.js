import { inject } from 'vue';

// Constant plugin key
const PLUGIN_KEY = 'recaptcha-plugin';

const initRecaptcha = () => {
    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
    if (!recaptchaKey) console.error('Missing Google Recaptcha Key');
    if (!document.getElementById(recaptchaKey)) {
        const script = document.createElement('script');
        script.id = recaptchaKey;
        script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
}

const recaptcha = {
    challengeInput: async (action, callback) => {
        console.log();
        if (!(window.grecaptcha)) initRecaptcha();
        window.grecaptcha.ready(async () => {
            const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
            const token = await window.grecaptcha.execute(recaptchaKey, { action: action });
            callback(token);
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
        initRecaptcha();
        // Provide the plugin
        app.provide(PLUGIN_KEY, recaptcha)
    }
};

