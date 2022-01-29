<template>
  <v-hero :full-height="true" class="bg-gradient-to-t from-brand_secondary to-brand_primary" title="404.hero.title" subtitle="404.hero.subtitle">
    <template #buttons>
      <v-button format="secondary" href="/" target="_self" aria="Go to back to homepage" :external="false" :white="true" text="GO BACK TO HOME" />
    </template>
  </v-hero>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';
import { useMeta } from 'vue-meta';

useMeta({ title: '404', description: "The page you are looking for doesn't exist" });
</script>
