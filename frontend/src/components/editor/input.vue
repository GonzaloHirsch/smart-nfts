<template>
  <div class="flex flex-col">
    <label v-show="!props.hideLabel" :aria-hidden="hideLabel" :class="['mb-1', error ? 'text-error' : '']" :for="props.id">{{ props.label }}</label>
    <!-- If continuous input, it will use the @input to trigger on each key -->
    <input
      v-if="continuousInput"
      :class="['rounded-sm transition-colors duration-300', classes, error ? 'input-error' : '']"
      type="text"
      :name="props.name"
      :id="props.id"
      :placeholder="props.placeholder"
      @input="onInputChanged"
      :value="modelValue"
    />
    <!-- Otherwise use a discrete approach, just event when focus is lost -->
    <input
      v-else
      :class="['rounded-sm transition-colors duration-300', classes, error ? 'input-error' : '']"
      type="text"
      :name="props.name"
      :id="props.id"
      :placeholder="props.placeholder"
      @change="onInputChanged"
      :value="modelValue"
    />
    <!-- Showing the error -->
    <span v-if="error" class="text-error text-xs mt-xs">{{ $t(error) }}</span>
  </div>
</template>

<script setup>
import { applyValidations } from '@/js/validations.js';
import { computed, ref } from 'vue';

const emit = defineEmits(['update:modelValue', 'validInput', 'invalidInput']);

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String
  },
  format: {
    type: String,
    default: 'primary'
  },
  continuousInput: {
    type: Boolean,
    default: false
  },
  validations: {
    type: Array,
    default: []
  }
});

const error = ref(undefined);

// Compute classes depending on the format
const classes = computed(() => {
  switch (props.format) {
    case 'primary':
      return `input--${props.format} border-2 border-typography_secondary focus:border-brand_primary bg-transparent`;
    case 'primary-white':
      return `input--${props.format} border-2 border-white focus:border-white bg-white text-typography_secondary`;
  }
});

// Handle input changed
const onInputChanged = (e) => {
  // If no validations are present, the input is assumed valid
  if (props.validations.length > 0) {
    // Try validations
    let validationResult = applyValidations(e.target.value, props.validations);
    let isValid = true;
    // Reset error
    error.value = undefined;
    // Evaluate if there are errors
    validationResult.forEach((result) => {
      isValid = isValid && result === true;
      // Keep first error present
      if (result !== true && error.value === undefined) {
        error.value = result.message;
      }
    });
    // Emit input state depending on the validation
    if (isValid) emit('validInput');
    else emit('invalidInput', error.value);
  }
  emit('update:modelValue', e.target.value);
};
</script>

<style scoped>
.input-error {
  @apply border-2 border-error !important;
}

.input--primary::placeholder {
  @apply text-typography_secondary text-opacity-30;
}

.input--primary-white::placeholder {
  @apply text-typography_secondary text-opacity-30;
}
</style>
