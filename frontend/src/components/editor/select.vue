<template>
    <div class="flex flex-col">
        <label v-show="!props.hideLabel" :aria-hidden="hideLabel" :class="['mb-1', error ? 'text-error' : '']" :for="props.id">{{
            props.label
        }}</label>
        <select
            :disabled="props.disabled"
            @change="onInputChanged"
            :value="props.modelValue"
            :name="props.name"
            :id="props.id"
            :class="['rounded-lg transition-colors duration-300', classes, error ? 'input-error' : '', props.disabled ? 'bg-gray-300/50' : '']"
        >
            <option v-for="(option, index) in props.options" :key="index" :value="option.value" :selected="props.modelValue === option.value">{{ option.text }}</option>
        </select>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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
    label: {
        type: String,
        required: false
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
    options: {
        type: Array
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const error = ref(undefined);

// Compute classes depending on the format
const classes = computed(() => {
    switch (props.format) {
        case 'primary':
            return `input--${props.format} border-2 border-brand_secondary focus:border-brand_primary bg-transparent`;
        case 'primary-white':
            return `input--${props.format} border-2 border-white focus:border-white bg-white text-typography_secondary`;
    }
});

// Handle input changed
const onInputChanged = (e) => {
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
