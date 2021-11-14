<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | SITE_NAME` : `SITE_NAME` }}</template>
    <template v-slot:description="{ content }">{{ content ? `${content}` : `SITE_DESCRIPTION` }}</template>
    <template v-slot:script="{ content }">{{ content }}</template>
    <template v-slot:og(title)="{ og }">{{ og.title }}</template>
    <template v-slot:og(description)="{ og }">{{ og.description }}</template>
    <template v-slot:og(image)="{ og }">{{ og.image }}</template>
    <template v-slot:og(url)="{ og }">{{ og.url }}</template>
    <template v-slot:twitter(card)="{ twitter }">{{ twitter.card }}</template>
  </metainfo>
  <div class="relative" ref="app">
    <v-navbar ref="navbar" />
    <main>
      <router-view />
    </main>
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

let counter = ref(0);
setInterval(() => {
  counter.value++;
}, 1000);

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
  htmlAttrs: { amp: true },
  twitter: {
    card: "summary"
  }
});
</script>
