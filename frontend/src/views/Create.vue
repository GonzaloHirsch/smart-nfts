<template>
  <v-hero :full-height="true" class="bg-custom_gradient_2 bg-cover" title="create.new.hero.title" subtitle="create.new.hero.subtitle">
    <template #buttons>
      <v-button
        :format="isLoading ? 'disabled' : 'secondary'"
        aria="Create a new NFT"
        :external="false"
        :white="true"
        text="NEW"
        class="mr-sm md:mr-md lg:mr-xl"
        :loading="isLoading"
        :disabled="isLoading"
        @click="createNewContract"
      />
      <v-button
        :format="isLoading ? 'disabled' : 'secondary'"
        aria="Continue with an existing contract"
        :external="false"
        :white="true"
        text="EXISTING"
        :loading="isLoading"
        :disabled="isLoading"
        @click="switchToExistingContract"
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
const api = useApi();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

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
const switchToExistingContract = () => {
  router.push({ path: '/existing' });
};

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Create',
  description: 'This is the homepage to our project'
});
</script>
