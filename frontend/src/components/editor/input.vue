<template>
  <div class="flex flex-col">
    <label class="mb-1" :for="props.id">{{ props.label }}</label>
    <input
      class="rounded-sm border-2 border-typography_secondary focus:border-brand_primary bg-transparent transition-colors duration-300"
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
  modelValue: {
    type: String
  }
});

const onInputChanged = (e) => {
  emit('update:modelValue', e.target.value);
};
</script>

<style scoped></style>
