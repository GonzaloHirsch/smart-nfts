<template>
  <v-accordion :title="props.method.name" :format="props.format">
    <template #header>
      <v-button
        format="primary"
        :aria="`Execute the ${props.method.name} method`"
        :external="false"
        :white="false"
        size="xsmall"
        :text="$t('interact.buttons.execute').toUpperCase()"
        @click.native.stop="callMethod(method)"
      />
      <QuestionMarkCircleIcon class="ml-sm w-7 h-7 text-brand_tertiary" @click.stop="getHelp(method)" />
      <span v-if="errors" class="ml-sm text-error">{{ errors }}</span>
    </template>
    <template v-if="props.method.inputs && props.method.inputs.length > 0" #content>
      <template v-for="(input, index) in props.method.inputs" :key="`read-${index}`">
        <v-input
          :id="`${props.method.name}-${input.name}`"
          :name="input.name"
          :label="`${input.name} (${input.type})`"
          :hideLabel="false"
          :placeholder="`${input.name} (${input.type})`"
          v-model="inputs[input.name]"
          :continuousInput="false"
          format="primary-white"
          class="mb-xs"
        />
      </template>
    </template>
  </v-accordion>
</template>

<script setup>
import vAccordion from '@/components/accordion.vue';
import vInput from '@/components/editor/input.vue';
import vButton from '@/components/button.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  method: {
    type: Object,
    default: {}
  },
  format: {
    type: String,
    default: 'white'
  }
});

const inputs = ref({});
const errors = ref(undefined);

const callMethod = () => {
  // Validate inputs
  let hasError = false;
  props.method.inputs.forEach((input) => {
    if (
      !(input.name in inputs.value && inputs.value[input.name] !== '' && inputs.value[input.name] !== null && inputs.value[input.name] !== undefined)
    ) {
      hasError = hasError || true;
      errors.value = t('interact.error.missingParameter', [input.name, input.type]);
    }
  });
  // Call methods
  if (!hasError) {
    errors.value = undefined;
    console.log(props.method, inputs.value);
  }
};
</script>
