<template>
  <v-hero :full-height="true" class="bg-custom_gradient_1 bg-cover" title="app.name" subtitle="home.hero.subtitle">
    <template #buttons>
      <v-button format="secondary" href="/create" target="_self" aria="Go to create page" :external="false" :white="true" text="CREATE" class="mr-sm md:mr-md lg:mr-xl" />
      <v-button format="secondary" href="/interact" target="_self" aria="Go to interact page" :external="false" :white="true" text="INTERACT" />
    </template>
    <a href="#explained" class="text-typography_primary text-center mt-xl text-body_xl flex flex-row items-center justify-center">
      Learn More
      <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
    </a>
  </v-hero>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { useMeta } from 'vue-meta';

useMeta({
  title: 'Homepage',
  description: 'This is the homepage to our project'
});
</script>
