<template>
  <form>
    <h2 class="text-center text-brand_primary">Features</h2>
    <div class="divide-y divide-typography_secondary">
      <div class="form--section">
        <h5 class="form--title">Contract Information <QuestionMarkCircleIcon class="form--title-icon" /></h5>
        <div class="flex flex-row justify-between">
          <v-input id="name" name="name" placeholder="SmartNFT..." label="Contract Name" v-model="contractData.name" class="w-6/12 pr-2" />
          <v-input id="symbol" name="symbol" placeholder="SNFT..." label="Contract Symbol" v-model="contractData.symbol" class="w-6/12 pl-2" />
        </div>
      </div>
      <!-- <div class="form--section">
        <h5 class="form--title">Permissions <QuestionMarkCircleIcon class="form--title-icon" /></h5>
      </div> -->
      <div class="form--section">
        <h5 class="form--title">Creation <QuestionMarkCircleIcon class="form--title-icon" /></h5>
        <v-checkbox
          id="isMintable"
          name="isMintable"
          placeholder="Is Mintable?"
          label="Is Mintable?"
          v-model="contractData.isMintable"
          class="w-6/12"
        />
        <v-checkbox
          id="isPausable"
          name="isPausable"
          placeholder="Is Pausable?"
          label="Is Pausable?"
          v-model="contractData.isPausable"
          class="w-6/12"
        />
        <v-checkbox
          id="isBurnable"
          name="isBurnable"
          placeholder="Is Burnable?"
          label="Is Burnable?"
          v-model="contractData.isBurnable"
          class="w-6/12"
        />
        <v-checkbox
          id="isAutoIncrementIds"
          name="isAutoIncrementIds"
          placeholder="Has auto incrementable IDs?"
          label="Has auto incrementable IDs?"
          v-model="contractData.isAutoIncrementIds"
          class="w-6/12"
        />
      </div>
      <!-- <div class="form--section">
        <h5 class="form--title">Metadata <QuestionMarkCircleIcon class="form--title-icon" /></h5>
      </div> -->
    </div>
    <!-- ACTIONS -->
    <div class="flex flex-row items-center justify-center">
      <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="SAVE" @click="saveContract" />
      <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="DEPLOY" class="mx-sm" @click="test" />
      <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="DOWNLOAD" @click="test" />
    </div>
  </form>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vCheckbox from '@/components/editor/checkbox.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import { ref, watch } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

const props = defineProps({});

const contractData = ref({
  name: undefined,
  symbol: undefined,
  isMintable: false,
  isPausable: false,
  isBurnable: false,
  isAutoIncrementIds: false
});

const test = () => {
  api.healthCheck();
};
const saveContract = () => {
  api.saveContract('1234', contractData.value);
};

const emit = defineEmits(['contractChanged']);
watch(
  () => contractData.value,
  () => {
    emit('contractChanged', contractData.value);
  },
  { deep: true }
);
</script>

<style>
.form--title {
  @apply text-brand_primary flex items-center;
}

.form--title-icon {
  @apply h-6 w-6 text-brand_tertiary ml-xs;
}

.form--section {
  @apply py-sm;
}
</style>
