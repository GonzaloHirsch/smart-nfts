<template>
    <div class="flex flex-row items-center">
        <input
            class="rounded-sm border-2 text-brand_secondary border-typography_secondary focus:border-brand_primary bg-transparent transition duration-300 cursor-pointer editor--checkbox"
            type="checkbox"
            :name="name"
            :id="id"
            :placeholder="placeholder"
            @input="onInputChanged"
            :value="modelValue"
            :checked="modelValue"
        />
        <label class="ml-1" :for="id">{{ label }}</label>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
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
        type: Boolean
    }
});

const onInputChanged = (e) => {
    emit('update:modelValue', e.target.checked);
};
</script>

<style scoped>
.editor--checkbox {
    @apply outline-none shadow-transparent ring-0 !important;
}
</style>
