<template>
  <v-section :noPadding="true" :class="[isLoading ? 'bg-gray-300' : !validContract ? 'bg-red-500' : 'bg-typography_primary']">
    <div class="flex flex-row">
      <div class="flex flex-col w-8/12 bg-light rounded-r-2xl pt-sm pb-base px-md entire-panel" :style="panelStyle">
        <div class="flex flex-row justify-between items-center">
          <h2 class="text-left text-brand_primary">Contract</h2>
          <v-input
            id="contract_id"
            name="contract_id"
            label="Contract ID"
            :hideLabel="true"
            placeholder="Contract ID..."
            v-model="contractId"
            :continuousInput="false"
            format="primary-white"
          />
        </div>
        <v-interacter v-if="!isLoading" :abi="contract.abi" :validContract="validContract" :hasContract="hasContract" />
        <div v-else class="w-full flex flex-row items-center justify-center h-full mx-auto my-auto">
          <span class="text-h5">{{ $t('interact.loading.methods') }}</span
          ><RefreshIcon class="h-12 w-12 animate-spin" />
        </div>
      </div>
      <div class="flex flex-col items-center justify-center w-4/12 text-xs transition-colors duration-200">
        <div v-if="!isLoading && validContract && hasContract">RESULTS</div>
        <div v-else-if="!hasContract" class="w-full flex flex-row items-center justify-center h-full mx-auto my-auto">
          <span class="text-h5 text-center">{{ $t('interact.loading.initial') }}</span>
        </div>
        <div v-else-if="isLoading" class="w-full flex flex-row items-center justify-center h-full mx-auto my-auto">
          <span class="text-h5">{{ $t('interact.loading.contract') }}</span
          ><RefreshIcon class="h-12 w-12 animate-spin" />
        </div>
        <div v-else-if="!validContract" class="w-full flex flex-row items-center justify-center h-full mx-auto my-auto text-typography_primary">
          <span class="text-h5 text-center">{{ $t('interact.error.invalidContract') }}</span>
        </div>
      </div>
    </div>
  </v-section>

  <v-section class="bg-typography_primary">
    <h2 class="text-center text-brand_primary mb-base">Methods Explained</h2>
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
import vInput from '@/components/editor/input.vue';
import vInteracter from '@/components/interacter.vue';
import vSection from '@/components/section.vue';
import { PlayIcon, RefreshIcon } from '@heroicons/vue/solid';
import { NAV_HEIGHT } from '@/js/constants.js';

// Router
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
  router = useRouter();

import { ref, computed, watch, inject } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const isLoading = ref(false);
const validContract = ref(true);
const contractId = ref(undefined);
const contract = ref({});
const hasContract = computed(() => !(contractId.value === '' || contractId.value === null || contractId.value === undefined));

watch(
  () => contractId.value,
  () => {
    router.replace({
      path: contractId.value ? `/interact/${contractId.value}` : '/interact'
    });
  }
);
watch(
  () => route.params.id,
  () => {
    // We need this line because the watcher is immediate, this makes it run before most of the other stuff
    // That way we load from the url properly
    // If we don't have this if, when you navigate out of this page with a link, it will keep you on the page
    // tl;dr; we need this for the page navigation to work
    if (route.path.includes('/interact')) {
      if (!(route.params.id === '' || route.params.id === null || route.params.id === undefined)) {
        contractId.value = route.params.id;
        // Get the contract
        isLoading.value = true;
        api
          .getContract(contractId.value)
          .then((res) => {
            isLoading.value = false;
            contract.value = res.data;
            validContract.value = true;
          })
          .catch((err) => {
            isLoading.value = false;
            validContract.value = false;
            setSnackbar("Contract doesn't exist!", 'error', 5);
          });
      } else {
        contractId.value = undefined;
        contract.value = {};
        validContract.value = true;
      }
    }
  },
  { immediate: true }
);

// Panel Style
const navHeight = inject(NAV_HEIGHT);
const panelStyle = computed(() => {
  return navHeight.value
    ? { maxHeight: `calc(100vh - ${navHeight.value}px)`, minHeight: `calc(100vh - ${navHeight.value}px)` }
    : { maxHeight: '100vh', minHeight: '100vh' };
});

// Meta
import { useMeta } from 'vue-meta';
useMeta({
  title: 'Contract Interaction',
  description: 'This is the homepage to our project'
});
</script>

<style>
.entire-panel {
  @apply overflow-y-auto;
}
.entire-panel {
  direction: rtl;
}

.entire-panel div {
  direction: ltr;
}
</style>
