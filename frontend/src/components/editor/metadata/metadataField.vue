<template>
    <div class="grid grid-cols-7 gap-xs mb-xs">
        <v-input
            :name="`name-${props.id}`"
            :id="`name-${props.id}`"
            format="primary-white"
            placeholder="Field name..."
            :validations="['required', 'metadataName', 'max20']"
            :hideLabel="true"
            :hideError="true"
            :label="'Field Name'"
            v-model="metadataField.name"
            :value="props.name"
            @validInput="handleValidInput"
            @invalidInput="(error) => handleInvalidInput(error)"
            @change="handleInputChange"
            class="col-span-2"
        />
        <v-select
            :name="`type-${props.id}`"
            :id="`type-${props.id}`"
            format="primary-white"
            :hideLabel="true"
            :label="'Field Type'"
            v-model="metadataField.type"
            :value="props.type"
            class="col-span-2"
            @change="handleTypeChange"
            :options="typeOptions"
        />
        <v-select
            :name="`display-${props.id}`"
            :id="`display-${props.id}`"
            format="primary-white"
            :hideLabel="true"
            :label="'Field Type'"
            v-model="metadataField.display"
            :value="props.display"
            :disabled="metadataField.type !== 'number'"
            :class="['col-span-2']"
            @change="handleDisplayChange"
            :options="displayOptions"
        />
        <div class="flex justify-center items-center col-span-1">
            <XCircleIcon @click="handleRemoveEntry" class="w-8 h-8 cursor-pointer hover:text-error transition duration-200" />
        </div>
    </div>
    <span v-if="metadataField.error" class="text-error text-xs mt-xs">{{ $t(metadataField.error) }}</span>
</template>

<script setup>
import vInput from '@/components/editor/input.vue';
import vSelect from '@/components/editor/select.vue';
import { XCircleIcon } from '@heroicons/vue/solid';

import { ref, watch } from 'vue';
import { applyValidations, sumarizeValidationResults } from '@/js/validations.js';

const emit = defineEmits(['update:name', 'update:type', 'removeField']);
const props = defineProps({
    name: {
        type: String,
        default: undefined
    },
    type: {
        type: String,
        default: undefined
    },
    display: {
        type: String,
        default: undefined
    },
    // Id of the item, useful for the remove event
    id: {
        type: Number,
        required: true
    }
});

const metadataField = ref({
    name: props.name ?? undefined,
    type: props.type ?? undefined,
    error: undefined
});

const typeOptions = [
    {
        value: 'string',
        text: 'String'
    },
    {
        value: 'number',
        text: 'Number'
    }
];

const displayOptions = [
    {
        value: 'boost_number',
        text: 'Boost Number'
    },
    {
        value: 'boost_percentage',
        text: 'Boost Percentage'
    },
    {
        value: 'number',
        text: 'Plain Number'
    }
];

// Use valid input as means to update the model value
const handleValidInput = () => {
    metadataField.value.error = undefined;
};

const handleInvalidInput = (error) => {
    metadataField.value.error = error;
};

const handleInputChange = () => {
    if (!metadataField.value.error) emit('update:name', metadataField.value.name);
};

const handleTypeChange = () => {
    emit('update:type', metadataField.value.type);
    if (metadataField.value.type === 'number') {
        metadataField.value.display = displayOptions[displayOptions.length - 1].value;
    } else {
        metadataField.value.display = undefined;
    }
    handleDisplayChange();
};

const handleDisplayChange = () => {
    emit('update:display', metadataField.value.display);
};

const handleRemoveEntry = () => {
    emit('removeField', props.id);
};

// We need this watcher in order to update the internal state
watch(
    () => props.name,
    () => {
        // Apply validations just in case
        const validationResults = applyValidations(props.name, ['required', 'metadataName', 'max20']);
        const [isValid, error] = sumarizeValidationResults(validationResults);
        metadataField.value.name = props.name;
        metadataField.value.error = error;
    }
);
watch(
    () => props.type,
    () => {
        metadataField.value.type = props.type;
    }
);
watch(
    () => props.display,
    () => {
        metadataField.value.display = props.display;
    }
);
</script>
