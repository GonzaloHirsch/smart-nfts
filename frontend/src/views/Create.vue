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
      <v-button
        format="secondary"
        aria="Continue with an existing contract"
        :external="false"
        :white="true"
        text="EXISTING"
        @click="createNewContract"
      />
    </template>
  </v-hero>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';

import { ref } from 'vue';
import { useApi } from '@/plugins/api';
import { useRouter } from 'vue-router';
const router = useRouter();
const api = useApi();
const isLoading = ref(false);
const createNewContract = () => {
  isLoading.value = true;
  // Call API & wait for the response
  api.createContract().then((res) => {
    isLoading.value = false;
    if (res.data && res.data.id) {
      router.push(`/create/${res.data.id}`);
    }
  });
};

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Create',
  description: 'This is the homepage to our project'
});
</script>
