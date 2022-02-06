<template>
  <v-accordion :title="props.method.name" :format="props.format">
    <template #header>
      <!-- Icon for help -->
      <QuestionMarkCircleIcon class="w-7 h-7 text-brand_tertiary" @click.stop="getHelp" />
      <!-- Displaying the errors -->
      <span v-if="errors" class="ml-sm text-error">{{ errors }}</span>
      <v-button
        format="primary"
        :aria="`Execute the ${props.method.name} method`"
        :external="false"
        :white="false"
        size="xsmall"
        :text="$t('interact.buttons.execute').toUpperCase()"
        @click.native.stop="callMethod"
        class="ml-auto mr-sm"
      />
    </template>
    <template v-if="props.method.inputs && props.method.inputs.length > 0" #content>
      <template v-for="(input, index) in props.method.inputs" :key="`read-${index}`">
        <!-- Add the validations as the required one and the type check -->
        <!-- Receive the events for input validity -->
        <v-input
          :id="`${props.method.name}-${input.name}`"
          :name="input.name"
          :label="`${input.name} (${input.type})`"
          :hideLabel="false"
          :placeholder="$t(getParameterPlaceholder(input.type))"
          v-model="inputs[input.name]"
          :continuousInput="false"
          :validations="['required', input.type]"
          @validInput="() => handleValidInput(input.name)"
          @invalidInput="(error) => handleInvalidInput(input.name, error)"
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
import {getParameterPlaceholder} from '@/js/utils.js';

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

import { ref } from 'vue';
const inputs = ref({});
const inputsErrors = ref({});
const errors = ref(undefined);

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const callMethod = () => {
  // Validate inputs
  let hasError = false;
  props.method.inputs.forEach((input) => {
    // Check if the input is empty, cannot bypass this one, in case the user directly calls the method without touching the inputs
    if (
      !(input.name in inputs.value && inputs.value[input.name] !== '' && inputs.value[input.name] !== null && inputs.value[input.name] !== undefined)
    ) {
      hasError = hasError || true;
      errors.value = t('interact.error.missingParameter', [input.name, input.type]);
    }
    // Verify with the emitted errors from the inputs
    else if (inputsErrors.value[input.name] !== undefined) {
      hasError = hasError || true;
      errors.value = `${t(inputsErrors.value[input.name])} - ${input.name}`;
    }
  });
  // Call methods
  if (!hasError) {
    errors.value = undefined;
    // TODO: API CALL GOES HERE, WE COULD EMIT BACK AN EVENT THOUGH AS AN ALTERNATIVE
    console.log(props.method, inputs.value);
  }
};

// Handle updating the inner error storage for each input
const handleValidInput = (name) => {
  inputsErrors.value[name] = undefined;
};

const handleInvalidInput = (name, error) => {
  inputsErrors.value[name] = error;
};

// Go to the desired anchor in the current page
import { useRouter } from 'vue-router';
const router = useRouter();
const getHelp = () => {
  router.push({
    hash: `#${props.method.name}`
  });
};
</script>
