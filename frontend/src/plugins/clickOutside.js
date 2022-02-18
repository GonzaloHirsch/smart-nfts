// Plugin as per https://stackoverflow.com/questions/63869859/migrating-detect-click-outside-custom-directive-from-vue-2-to-vue-3

// Exporting install and other stuff
export const clickOutsidePlugin = {
    install: (app, options) => {
        app.directive('click-outside', {
            beforeMount(el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value(event, el);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unmounted(el) {
                document.body.removeEventListener('click', el.clickOutsideEvent);
            }
        });
    }
};