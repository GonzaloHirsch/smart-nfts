<template>
  <v-modal :showModal="isOpen" @close="handleModalClose">
    <template #title>
      <h2 class="text-brand_primary">Contract Saved</h2>
    </template>
    <p>THIS IS THE CONTENT</p>
  </v-modal>
  <v-section :noPadding="true" class="bg-typography_primary">
    <div v-if="!isLoadingEditor" class="flex flex-row">
      <div class="flex flex-col w-6/12 bg-light rounded-r-2xl pt-sm pb-base px-md">
        <v-editor
          @contractChanged="handleContractChange"
          :name="storedContract.name"
          :symbol="storedContract.symbol"
          :extensions="storedContract.extensions"
        >
        <span v-if="!isLoading && contractEdited" class="flex items-center mt-sm text-sm">{{$t('editor.last_saved', [ $d(lastSaved, 'short') ])}}</span>
        <span v-else-if="isLoading" class="flex items-center mt-sm text-sm">{{$t('editor.saving')}} <RefreshIcon class="h-4 w-4 animate-spin" /></span>
        </v-editor>
      </div>
      <div class="flex w-6/12 p-sm">
        <v-code-viewer class="flex flex-col w-full" :code="contract" :loading="isLoading" />
      </div>
    </div>
    <div v-else class="flex flex-row items-center justify-center p-xs md:p-md">
      <div class="bg-brand_primary w-full rounded-lg text-typography_primary">
        <h4 class="flex items-center justify-center my-base py-xl">{{ $t('editor.prepare') }} <RefreshIcon class="h-10 w-10 animate-spin" /></h4>
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
import { QuestionMarkCircleIcon, RefreshIcon } from '@heroicons/vue/solid';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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

const contract = ref(t('editor.contract.empty'));
const storedContract = ref({});
const isLoading = ref(false);
const isLoadingEditor = ref(true);
const lastSaved = ref(undefined);
const contractEdited = ref(false);

const loadContract = () => {
  isLoadingEditor.value = true;
  api.getContract(route.params.id).then((res) => {
    storedContract.value = res.data;
    if (res.data.contract) {
      contractEdited.value = true;
      lastSaved.value = new Date();
      contract.value = res.data.contract;
    }
    isLoadingEditor.value = false;
  });
};
loadContract();

import { mapFormToApiData } from '@/js/mapper';
const handleContractChange = (contractData) => {
  let dataToSend = mapFormToApiData(contractData);
  if (dataToSend.name && dataToSend.symbol) {
    isLoading.value = true;
    api.editContract(route.params.id, mapFormToApiData(contractData)).then((res) => {
      contract.value = res.data.contract;
      contractEdited.value = true;
      lastSaved.value = new Date();
      isLoading.value = false;
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
