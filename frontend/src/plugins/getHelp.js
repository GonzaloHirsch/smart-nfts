import { inject } from 'vue';

let router;
// Constant plugin key
const PLUGIN_KEY = 'getHelp-plugin';

const getHelp = {
    getHelp: (hash) => {
        router.push({
            hash: `#${hash}`
        });
    }
}

// Method to inject API in any setup component
export const useHelp = () => {
    return inject(PLUGIN_KEY);
}

// Exporting install and other stuff
export const helpPlugin = {
    install: (app, options) => {
        // Expect the router in the options
        router = options.router
        if (!(router)) { console.error("Missing router in help plugin"); }
        // Provide the plugin
        app.provide(PLUGIN_KEY, getHelp)
    }
};

