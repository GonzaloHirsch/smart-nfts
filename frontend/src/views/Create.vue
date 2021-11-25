<template>
  <v-hero :full-height="true" class="bg-custom_gradient_2 bg-cover" title="create.hero.title" subtitle="create.hero.subtitle">
    <template #buttons>
      <v-button
        format="secondary"
        aria="Create a new NFT"
        :external="false"
        :white="true"
        text="NEW"
        class="mr-sm md:mr-md lg:mr-xl"
        @click="createNewContract"
      />
      <v-button format="secondary" aria="Continue with an existing contract" :external="false" :white="true" text="EXISTING" @click="createNewContract" />
    </template>
  </v-hero>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';

import { useRouter } from 'vue-router';
const router = useRouter();
const createNewContract = () => {
  router.push(`/create/${Math.random().toString(36).substr(2)}`);
}

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Create',
  description: 'This is the homepage to our project',
});
</script>
