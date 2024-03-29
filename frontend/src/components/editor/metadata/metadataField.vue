<template>
    <div :class="['grid grid-cols-10 gap-xs mb-xs relative transform transition duration-200', metadataField.error ? 'translate-x-4' : '']">
        <ExclamationIcon
            :class="[
                'absolute top-0 bottom-0 left-0 my-auto text-error h-6 w-6 transform transition duration-200',
                metadataField.error ? 'opacity-100 -translate-x-7' : 'opacity-0'
            ]"
        />
        <v-input
            :name="`name-${props.id}`"
            :id="`name-${props.id}`"
            format="primary-white"
            :placeholder="$t('inputs.placeholder.metadata.name')"
            :validations="['required', 'metadataName', 'max20']"
            :hideLabel="true"
            :hideError="true"
            :label="$t('inputs.text.metadata.name')"
            v-model="metadataField.name"
            :value="props.name"
            @validInput="handleValidInput"
            @invalidInput="(error) => handleInvalidInput(error)"
            @change="handleInputChange"
            class="col-span-3 text-sm"
            size="base"
        />
        <v-select
            :name="`type-${props.id}`"
            :id="`type-${props.id}`"
            format="primary-white"
            :hideLabel="true"
            :label="$t('inputs.text.metadata.type')"
            v-model="metadataField.type"
            :value="props.type"
            class="col-span-3"
            @change="handleTypeChange"
            :options="typeOptions"
        />
        <v-select
            :name="`display-${props.id}`"
            :id="`display-${props.id}`"
            format="primary-white"
            :hideLabel="true"
            :label="$t('inputs.text.metadata.display')"
            v-model="metadataField.display"
            :value="props.display"
            :disabled="metadataField.type !== 'number'"
            class="col-span-3"
            @change="handleDisplayChange"
            :options="displayOptions"
        />
        <div class="flex justify-center items-center col-span-1">
            <XCircleIcon
                @click="handleRemoveEntry"
                :aria-label="$t('aria.removeEntry')"
                class="w-8 h-8 cursor-pointer hover:text-error transition duration-200"
            />
        </div>
    </div>
    <span v-if="metadataField.error" class="text-error text-xs">{{ $t(metadataField.error) }}</span>
</template>

<script setup>
import vInput from '@/components/editor/input.vue';
import vSelect from '@/components/editor/select.vue';
import { XCircleIcon, ExclamationIcon } from '@heroicons/vue/solid';

import { ref, watch } from 'vue';
import { applyValidations, sumarizeValidationResults } from '@/js/validations.js';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const emit = defineEmits(['update:name', 'update:type', 'update:display', 'removeField']);
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
    },
    // Current names chosen, used for collision detection
    names: {
        type: Object,
        required: true
    }
});

const metadataField = ref({
    name: props.name ?? undefined,
    type: props.type ?? undefined,
    display: props.display ?? undefined,
    error: undefined
});

const typeOptions = [
    {
        value: 'string',
        text: t('inputs.text.metadata.typeOptions.string')
    },
    {
        value: 'number',
        text: t('inputs.text.metadata.typeOptions.number')
    }
];

const displayOptions = [
    {
        value: 'boost_number',
        text: t('inputs.text.metadata.displayOptions.boost_number')
    },
    {
        value: 'boost_percentage',
        text: t('inputs.text.metadata.displayOptions.boost_percentage')
    },
    {
        value: 'number',
        text: t('inputs.text.metadata.displayOptions.number')
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
    if (!metadataField.value.error) {
        if (metadataField.value.name in props.names && props.names[metadataField.value.name] > 0) {
            metadataField.value.error = 'editor.error.nameUsed';
        } else {
            emit('update:name', metadataField.value.name);
        }
    }
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
