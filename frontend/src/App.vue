<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | SITE_NAME` : `SITE_NAME`
    }}</template>
    <template v-slot:description="{ content }">{{
      content ? `${content}` : `SITE_DESCRIPTION`
    }}</template>
  </metainfo>
  <div class="relative" ref="app">
    <v-navbar ref="navbar" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useMeta } from "vue-meta";
import { ref, computed, watch, provide } from "vue";
import { useResizeObserver } from "@vueuse/core";

import { NAV_HEIGHT } from "@/js/constants.js";

// Components
import vNavbar from "@/components/navbar.vue";

let counter = ref(0);
setInterval(() => {
  counter.value++;
}, 1000);

const app = ref(null);
const navbar = ref(null);
const navbarHeight = ref(undefined);
provide(
  NAV_HEIGHT,
  navbarHeight
);
useResizeObserver(app, (_) => {
  navbarHeight.value = navbar.value?.$el.clientHeight;
});

// Meta
useMeta({
  title: "",
  description: "",
  htmlAttrs: { amp: true },
});
</script>
