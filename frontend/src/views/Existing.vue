<template>
  <v-hero :full-height="true" class="bg-custom_gradient_2 bg-cover" title="create.existing.hero.title" subtitle="create.existing.hero.subtitle">
    <template #buttons>
      <div class="flex flex-col items-center justify-center">
        <v-input
          id="contract_id"
          name="contract_id"
          label="Contract ID"
          :hideLabel="true"
          placeholder="Contract ID..."
          v-model="contractId"
          :continuousInput="true"
          format="primary-white"
          class="mb-sm"
        />
        <v-button
          :format="editDisabled ? 'disabled' : 'secondary'"
          aria="Continue with an existing contract"
          :external="false"
          :white="true"
          text="EDIT"
          :disabled="editDisabled"
          :loading="isLoading"
          @click="editContract"
        />
      </div>
    </template>
    <router-link to="/create" class="flex flex-row items-center mt-base text-typography_primary cursor-pointer transition duration-200">
      <ArrowLeftIcon class="w-5 h-5 mr-1" />Go Back
    </router-link>
  </v-hero>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';
import vInput from '@/components/editor/input.vue';
import { ArrowLeftIcon } from '@heroicons/vue/solid';

import { ref, computed, watch } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const isLoading = ref(false);

const contractId = ref(undefined);
const _editDisabled = ref(false);
const editDisabled = computed(() => {
  return contractId.value === undefined || contractId.value === '' || _editDisabled.value || isLoading.value;
});

const editContract = () => {
  isLoading.value = true;
  // Call API & wait for the response
  api
    .getContract(contractId.value)
    .then((res) => {
      isLoading.value = false;
      router.push(`/create/${contractId.value}`);
    })
    .catch((err) => {
      isLoading.value = false;
      _editDisabled.value = true;
      setSnackbar("Contract doesn't exist!", 'error', 5);
    });
};
watch(
  () => contractId.value,
  () => {
    // Edit must be disabled because the id is invalid
    if (_editDisabled.value) {
      _editDisabled.value = !_editDisabled.value;
    }
  }
);

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Existing Contract',
  description: 'This is the homepage to our project'
});
</script>
