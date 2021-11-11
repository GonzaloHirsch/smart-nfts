<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | SITE_NAME` : `SITE_NAME`
    }}</template>
    <template v-slot:description="{ content }">{{
      content ? `${content}` : `SITE_DESCRIPTION`
    }}</template>
  </metainfo>
  <div>
    <header class="bg-white shadow" v-if="$route.meta.title">
      <div class="px-sm py-sm mx-auto sm:px-md lg:px-xl">
        <h1
          @click="counter = 0"
          class="text-h2 font-bold leading-tight text-typography_secondary"
        >
          {{ $route.meta.title }} / {{ counter }}
        </h1>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useMeta } from "vue-meta";
import { ref } from "vue";

let counter = ref(0);
setInterval(() => {
  counter.value++;
}, 1000);

useMeta({
  title: "",
  description: "",
  htmlAttrs: { amp: true },
});
</script>
