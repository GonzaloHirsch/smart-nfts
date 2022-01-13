<template>
  <v-modal :showModal="isOpen" @close="handleModalClose">
    <template #title>
      <h2 class="text-brand_primary">Contract Saved</h2>
    </template>
    <p>THIS IS THE CONTENT</p>
  </v-modal>
  <v-section :noPadding="true" class="bg-typography_primary">
    <div class="flex flex-row">
      <div class="flex flex-col w-6/12 bg-light rounded-r-2xl pt-sm pb-base px-md">
        <v-editor @contractChanged="handleContractChange" />
      </div>
      <div class="flex w-6/12 p-sm">
        <v-code-viewer class="flex flex-col w-full" :code="contract" />
      </div>
    </div>
  </v-section>

  <v-section class="bg-typography_primary">
    <h2 class="text-center text-brand_primary mb-base">Fields Explained</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
      corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
    </p>
  </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vCodeViewer from '@/components/codeViewer.vue';
import vEditor from '@/components/editor.vue';
import vModal from '@/components/modal.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { useRoute } from 'vue-router';
const route = useRoute();

import { useApi } from '@/plugins/api';
const api = useApi();

import { ref } from 'vue';
const isOpen = ref(false);
const showModal = () => {
  isOpen.value = !isOpen.value;
};
const handleModalClose = () => {
  isOpen.value = false;
};

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Contract Editor',
  description: 'This is the homepage to our project'
});

const contract = ref(undefined);
api.loadContract().then((res) => {
  contract.value = res;
});

import { mapFormToApiData } from '@/js/mapper';
const handleContractChange = (contractData) => {
  let dataToSend = mapFormToApiData(contractData);
  if (dataToSend.name && dataToSend.symbol) {
    api.editContract(route.params.id, mapFormToApiData(contractData)).then((res) => {
      contract.value = res.data.contract;
    });
  }
};
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
