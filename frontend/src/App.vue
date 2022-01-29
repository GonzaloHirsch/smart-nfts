<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | Smart NFTs` : `Smart NFTs` }}</template>
    <template v-slot:description="{ content }">{{ content ? `${content}` : `SITE_DESCRIPTION` }}</template>
  </metainfo>
  <div class="relative" ref="app">
    <a class="skip-to-content-link" aria-label="Skip to main content" href="#main" aria-hidden="true">Skip to content</a>
    <v-navbar ref="navbar" />
    <main id="main">
      <router-view />
    </main>
    <v-snackbar/>
    <v-footer />
  </div>
</template>

<script setup>
import { useMeta } from 'vue-meta';
import { ref, computed, watch, provide } from 'vue';
import { useResizeObserver } from '@vueuse/core';

import { NAV_HEIGHT } from '@/js/constants.js';

// Components
import vNavbar from '@/components/static/navbar.vue';
import vFooter from '@/components/static/footer.vue';
import vSnackbar from '@/components/notifications/snackbar.vue';

const app = ref(null);
const navbar = ref(null);
const navbarHeight = ref(undefined);
provide(NAV_HEIGHT, navbarHeight);
useResizeObserver(app, (_) => {
  navbarHeight.value = navbar.value?.$el.clientHeight;
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
  @apply bg-white text-brand_primary rounded-b-md border-2 border-brand_primary z-50 px-sm py-xs font-text mx-auto w-max;
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
