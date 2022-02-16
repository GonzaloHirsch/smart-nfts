<template>
    <metainfo>
        <template v-slot:title="{ content }">{{ content ? `${content} | Smart NFTs` : `Smart NFTs` }}</template>
        <template v-slot:description="{ content }">{{ content ? `${content}` : `SITE_DESCRIPTION` }}</template>
    </metainfo>
    <div class="relative" ref="app">
        <a class="skip-to-content-link" aria-label="Skip to main content" href="#main">Skip to content</a>
        <v-navbar class="hidden md:block" ref="navbar" />
        <v-navbar-mobile class="block md:hidden" ref="navbarMobile" />
        <main id="main" class="overflow-hidden">
            <router-view />
        </main>
        <v-snackbar />
        <v-footer />
    </div>
</template>

<script setup>
import { useMeta } from 'vue-meta';
import { ref, provide, onMounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';

import { NAV_HEIGHT } from '@/js/constants.js';

// Components
import vNavbar from '@/components/static/navbar.vue';
import vNavbarMobile from '@/components/static/navbarMobile.vue';
import vFooter from '@/components/static/footer.vue';
import vSnackbar from '@/components/notifications/snackbar.vue';

const app = ref(null);
const navbar = ref(null);
const navbarMobile = ref(null);
const navbarHeight = ref(undefined);
provide(NAV_HEIGHT, navbarHeight);
useResizeObserver(app, (_) => {
    navbarHeight.value = navbar.value?.$el.clientHeight || navbarMobile.value?.$el.clientHeight;
});

// Recaptcha

onMounted(() => {
    // Dynamically create the recaptcha key script
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
});

// Meta
useMeta({
    title: '',
    description: '',
    htmlAttrs: { amp: true }
});
</script>

<style>
.skip-to-content-link {
    @apply bg-white text-brand_secondary rounded-b-md border-2 border-brand_secondary z-50 px-sm py-xs font-text mx-auto w-max;
    left: 0;
    right: 0;
    position: absolute;
    transform: translateY(-100%);
    transition: transform 0.3s;
}

.skip-to-content-link:focus {
    transform: translateY(0%);
}
</style>
