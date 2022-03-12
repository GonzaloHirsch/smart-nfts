<template>
    <div
        :class="{
            'flex flex-col': true,
            'input--size-large': props.size === 'large',
            'input--size-medium': props.size === 'medium',
            'input--size-small': props.size === 'small',
            'input--size-xsmall': props.size === 'xsmall'
        }"
    >
        <label v-show="!props.hideLabel" :aria-hidden="hideLabel" :class="['mb-1', error ? 'text-error' : '']" :for="props.id">{{
            props.label
        }}</label>
        <!-- If continuous input, it will use the @input to trigger on each key -->
        <div class="flex w-full">
            <input
                v-if="continuousInput"
                :class="['rounded-lg transition-colors duration-300 w-full', classes, error ? 'input-error' : '', 'text-input']"
                type="text"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                @input="onInputChanged"
                :value="modelValue"
                :autocomplete="props.autocomplete"
            />
            <!-- Otherwise use a discrete approach, just event when focus is lost -->
            <input
                v-else
                :class="['rounded-lg transition-colors duration-300 w-full', classes, error ? 'input-error' : '', 'text-input']"
                type="text"
                :name="props.name"
                :id="props.id"
                :placeholder="props.placeholder"
                @change="onInputChanged"
                :value="modelValue"
                :autocomplete="props.autocomplete"
            />
            <v-tooltip v-if="props.hasAutofill" :text="props.autofillHelp" class="self-end" positionY="bottom">
                <PencilIcon
                    @click="emit('update:modelValue', props.autofillValue)"
                    class="w-10 h-10 ml-1 bg-white rounded-lg text-brand_secondary p-1 hover:bg-white/75 cursor-pointer duration-300 ar-1/1"
                />
            </v-tooltip>
        </div>
        <!-- Showing the error -->
        <span v-if="error && !props.hideError" class="text-error text-xs mt-xs">{{ $t(error) }}</span>
    </div>
</template>

<script setup>
import { applyValidations, sumarizeValidationResults } from '@/js/validations.js';
import { computed, ref, watch } from 'vue';
import { PencilIcon } from '@heroicons/vue/solid';

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
    size: {
        type: String,
        default: 'small'
    },
    hasAutofill: {
        type: Boolean,
        default: false
    },
    autofillValue: {
        type: String,
        default: undefined
    },
    autofillHelp: {
        type: String,
        default: undefined
    }
});

const error = ref(undefined);

// Compute classes depending on the format
const classes = computed(() => {
    switch (props.format) {
        case 'primary':
            return `input--${props.format} border-2 border-brand_secondary focus:border-brand_secondary focus:ring-brand_secondary bg-transparent`;
        case 'primary-white':
            return `input--${props.format} border border-gray-400 focus:border-white bg-white focus:ring-brand_secondary text-typography_secondary`;
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
</style>
