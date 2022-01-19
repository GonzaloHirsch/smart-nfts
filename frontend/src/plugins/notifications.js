import { ref, computed, inject } from 'vue';

const NOTIFICATIONS_CONSTANT = 'notifications';

// Internal state
const _snackbarContent = ref({});
const _timeout = ref(null);

// SNACKBAR
const setSnackbar = (text, format = 'default', timeout = undefined) => {
    // If there's already content, disable it and give it time to go down
    if (_snackbarContent.value.text && !(_timeout.value)) {
        _snackbarContent.value = {};
        _timeout.value = setTimeout(() => setSnackbar(text, format, timeout), 250);
    } else {
        // If a timeout exists, just clear it
        if (_timeout.value) {
            clearTimeout(_timeout.value);
            _timeout.value = undefined;
        }
        _snackbarContent.value = {
            text: text,
            format: format,
            timeout: timeout
        };
    }
};
const setSnackbarTimeout = (timeout = 3) => {
    _snackbarContent.value.timeout = timeout;
};
const clearSnackbar = () => {
    _snackbarContent.value = {};
};

// Exposed section
const _notificationsPlugin = {
    snackbarContent: computed(() => _snackbarContent.value),
    setSnackbar,
    setSnackbarTimeout,
    clearSnackbar
};

export const useNotifications = () => {
    return inject(NOTIFICATIONS_CONSTANT);
};

export const notificationsPlugin = {
    install: (app) => {
        app.provide(NOTIFICATIONS_CONSTANT, _notificationsPlugin);
    },
};