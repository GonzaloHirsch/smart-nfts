<template>
  <div class="flex flex-col divide-y-2 divide-brand_primary h-full">
    <template v-if="validContract && hasContract">
      <div class="mb-sm">
        <h4>Read</h4>
        <template v-for="(method, index) in availableMethods_read" :key="`read-${index}`">
          <v-method-accordion :method="method" class="mb-xs"/>
        </template>
      </div>
      <div class="pt-sm">
        <h4>Write</h4>
        <template v-for="(method, index) in availableMethods_write" :key="`write-${index}`">
          <v-method-accordion :method="method" class="mb-xs"/>
        </template>
      </div>
    </template>
    <template v-else-if="!validContract">
      <div class="bg-red-500 text-center text-typography_primary my-auto mx-auto h-20 px-xl rounded-md flex flex-col items-center justify-center">
        {{ $t('interact.error.invalidContract') }}
      </div>
    </template>
    <template v-else-if="!hasContract">
      <div class="my-auto mx-auto flex flex-col items-center justify-center text-h5 text-center">
        {{ $t('interact.loading.initialMethods') }}
      </div>
    </template>
  </div>
</template>

<script setup>
import vMethodAccordion from '@/components/interaction/methodAccordion.vue'
import vButton from '@/components/button.vue';

import { computed } from 'vue';

const props = defineProps({
  abi: {
    type: Array,
    default: []
  },
  validContract: {
    type: Boolean,
    default: true
  },
  hasContract: {
    type: Boolean,
    default: false
  }
});

// Wait for the props to change and generate the structure acording to that
const availableMethods_read = computed(() => props.abi.filter((method) => method.type === 'function' && method.stateMutability === 'view'));
const availableMethods_write = computed(() => props.abi.filter((method) => method.type === 'function' && method.stateMutability === 'nonpayable'));
</script>
