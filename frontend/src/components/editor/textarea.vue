<template>
    <div class="flex flex-col">
        <label v-show="!props.hideLabel" :aria-hidden="hideLabel" :class="['mb-1', error ? 'text-error' : '']" :for="props.id">{{
            props.label
        }}</label>
        <div class="flex flex-col relative">
            <!-- If continuous input, it will use the @input to trigger on each key -->
            <textarea
                v-if="continuousInput"
                :class="['rounded-lg transition-colors duration-300', classes, error ? 'input-error' : '']"
                type="text"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                @input="onInputChanged"
                :value="modelValue"
                :autocomplete="props.autocomplete"
                :rows="props.rows"
            >
            </textarea>
            <!-- Otherwise use a discrete approach, just event when focus is lost -->
            <textarea
                v-else
                :class="['rounded-lg transition-colors duration-300', classes, error ? 'input-error' : '']"
                type="text"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                @change="onInputChanged"
                :value="modelValue"
                :autocomplete="props.autocomplete"
                :rows="props.rows"
            />
            <!-- Show character count -->
            <span v-if="!props.hideCounter" class="absolute top-0 right-0 text-typography_secondary counter">{{ modelValue ? modelValue.length : 0 }}</span>
        </div>
        <!-- Showing the error -->
        <span v-if="error && !props.hideError" class="text-error text-xs mt-xs">{{ $t(error) }}</span>
    </div>
</template>

<script setup>
import { applyValidations, sumarizeValidationResults } from '@/js/validations.js';
import { computed, ref, watch } from 'vue';

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
        required: false
    },
    hideLabel: {
        type: Boolean,
        default: false
    },
    hideError: {
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
    },
    autocomplete: {
        type: String,
        default: undefined
    },
    rows: {
        type: Number,
        default: 4
    },
    hideCounter: {
        type: Boolean,
        default: false
    },
});

const error = ref(undefined);

// Compute classes depending on the format
const classes = computed(() => {
    switch (props.format) {
        case 'primary':
            return `input--${props.format} border-2 border-brand_secondary focus:border-brand_secondary focus:ring-brand_secondary bg-transparent`;
        case 'primary-white':
            return `input--${props.format} border-2 border-white focus:border-white bg-white focus:ring-brand_secondary text-typography_secondary`;
    }
});

// Handle input changed
const onInputChanged = (e) => {
    // If no validations are present, the input is assumed valid
    if (props.validations.length > 0) {
        // Try validations
        let validationResult = applyValidations(e.target.value, props.validations);
        const [isValid, _error] = sumarizeValidationResults(validationResult);
        error.value = _error;
        // Emit input state depending on the validation
        if (isValid) emit('validInput');
        else emit('invalidInput', error.value);
    }
    emit('update:modelValue', e.target.value);
};

// Watch for changes in case the model value changes
watch(
    () => props.modelValue,
    () => {
        // Try validations
        let validationResult = applyValidations(props.modelValue, props.validations);
        const [isValid, _error] = sumarizeValidationResults(validationResult);
        error.value = _error;
        // Emit input state depending on the validation
        if (isValid) emit('validInput');
        else emit('invalidInput', error.value);
    }
);
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

.counter {
    @apply border-2 border-gray-500 px-xs rounded-tr-lg rounded-bl-md text-body_xs font-bold bg-gray-300;
    margin-top: -1px;
    margin-right: -1px;
}
</style>
