<template>
  <div class="flex flex-col">
    <label v-show="!props.hideLabel" :aria-hidden="hideLabel" class="mb-1" :for="props.id">{{ props.label }}</label>
    <!-- If continuous input, it will use the @input to trigger on each key -->
    <input
      v-if="continuousInput"
      :class="['rounded-sm transition-colors duration-300', classes]"
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
      :class="['rounded-sm transition-colors duration-300', classes]"
      type="text"
      :name="props.name"
      :id="props.id"
      :placeholder="props.placeholder"
      @change="onInputChanged"
      :value="modelValue"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);

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
  }
});

const classes = computed(() => {
  switch (props.format) {
    case 'primary':
      return 'border-2 border-typography_secondary focus:border-brand_primary bg-transparent';
    case 'primary-white':
      return 'border-2 border-white focus:border-white bg-white text-typography_secondary';
  }
});

const onInputChanged = (e) => {
  emit('update:modelValue', e.target.value);
};
</script>

<style scoped></style>
