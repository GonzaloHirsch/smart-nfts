<template>
    <v-accordion :title="props.method.name" :format="props.format">
        <template #header>
            <!-- Icon for help -->
            <QuestionMarkCircleIcon class="w-7 h-7 text-brand_tertiary" @click.stop="getHelp" />
            <!-- Displaying the errors -->
            <span v-if="errors" class="ml-sm text-error">{{ errors }}</span>
            <v-button
                :format="isLoading ? 'disabled' : 'primary'"
                :disabled="isLoading"
                :loading="isLoading"
                :aria="`Execute the ${props.method.name} method`"
                :external="false"
                :white="false"
                size="xsmall"
                :text="$t('interact.buttons.execute').toUpperCase()"
                @click.native.stop="callMethod"
                class="ml-auto mr-sm"
            />
        </template>
        <template v-if="(props.method.inputs && props.method.inputs.length > 0) || callError || callResult" #content>
            <div class="divide-y divide-white">
                <!-- Basic inputs -->
                <div v-if="props.method.inputs && props.method.inputs.length > 0">
                    <template v-for="(input, index) in props.method.inputs" :key="index">
                        <!-- Add the validations as the required one and the type check -->
                        <!-- Receive the events for input validity -->
                        <!-- Hide the uri field, we take care of that -->
                        <v-input
                            v-if="!props.metadata || !isUriField(input)"
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
                </div>
                <template v-if="props.metadata">
                    <div class="mt-sm pt-sm">
                        <p class="text-h5">Metadata</p>
                        <p v-if="props.metadata.hasImage" class="text-lg mt-sm">Image</p>
                        <v-file-input v-if="props.metadata.hasImage" v-model="metadataImage"></v-file-input>
                        <p class="text-lg mt-sm">Details</p>
                        <v-input
                            :id="`${props.method.name}-metadata-name`"
                            :name="`metadata-name`"
                            :label="`Name (string)`"
                            :hideLabel="false"
                            :placeholder="$t(getParameterPlaceholder('string'))"
                            v-model="detailInputs.name"
                            :continuousInput="false"
                            :validations="['required', 'string']"
                            @validInput="() => handleValidDetailsInput('name')"
                            @invalidInput="(error) => handleInvalidDetailsInput('name', error)"
                            format="primary-white"
                            class="mb-xs"
                        />
                        <v-textarea
                            :id="`${props.method.name}-metadata-description`"
                            :name="`metadata-description`"
                            :label="`Description (long string)`"
                            :hideLabel="false"
                            :placeholder="$t(getParameterPlaceholder('long string'))"
                            v-model="detailInputs.description"
                            :continuousInput="false"
                            :validations="['required', 'long_string']"
                            @validInput="() => handleValidDetailsInput('description')"
                            @invalidInput="(error) => handleInvalidDetailsInput('description', error)"
                            format="primary-white"
                            class="mb-xs"
                        />
                        <p v-if="props.metadata.attributes.length > 0" class="text-lg mt-sm">Fields</p>
                        <template v-for="(metadataField, index) in props.metadata.attributes" :key="index">
                            <v-input
                                :id="`${props.method.name}-metadata-${metadataField.traitType}`"
                                :name="`metadata-${metadataField.traitType}`"
                                :label="`${metadataField.traitType} (${metadataField.traitFormat}${
                                    metadataField.displayType ? ' - ' + $t(`inputs.text.${metadataField.displayType}`) : ''
                                })`"
                                :hideLabel="false"
                                :placeholder="
                                    $t(getParameterPlaceholder(metadataField.displayType ? metadataField.displayType : metadataField.traitFormat))
                                "
                                v-model="metadataInputs[metadataField.traitType]"
                                :continuousInput="false"
                                :validations="
                                    metadataField.displayType
                                        ? ['required', metadataField.traitFormat, metadataField.displayType]
                                        : ['required', metadataField.traitFormat]
                                "
                                @validInput="() => handleValidMetadataInput(metadataField.traitType)"
                                @invalidInput="(error) => handleInvalidMetadataInput(metadataField.traitType, error)"
                                format="primary-white"
                                class="mb-xs"
                            />
                        </template>
                    </div>
                </template>
                <template v-if="callResult || callError">
                    <div :class="[props.metadata || (props.method.inputs && props.method.inputs.length > 0) ? 'mt-sm pt-sm' : '']">
                        <p class="text-h5">Result</p>
                        <div class="w-full bg-white rounded-md p-xs mt-sm pr-base relative break-words">
                            <p v-if="callResult" class="text-typography_secondary">{{ callResult }}</p>
                            <p v-if="callError" class="text-error">{{ callError }}</p>
                            <div
                                class="absolute right-0 top-0 text-black hover:text-brand_secondary hover:bg-brand_primary cursor-pointer p-1 border border-black rounded-md transition duration-200"
                                @click="() => copyResponse(callResult || callError)"
                            >
                                <DocumentDuplicateIcon class="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </v-accordion>
</template>

<script setup>
import vAccordion from '@/components/accordion.vue';
import vInput from '@/components/editor/input.vue';
import vTextarea from '@/components/editor/textarea.vue';
import vFileInput from '@/components/editor/fileInput.vue';
import vButton from '@/components/button.vue';
import { QuestionMarkCircleIcon, DocumentDuplicateIcon } from '@heroicons/vue/solid';
import { getParameterPlaceholder } from '@/js/utils.js';

const props = defineProps({
    method: {
        type: Object,
        default: {}
    },
    format: {
        type: String,
        default: 'white'
    },
    metadata: {
        type: Object,
        default: undefined
    },
    isMint: {
        type: Boolean,
        default: false
    }
});

import { ref } from 'vue';
const inputs = ref({});
const metadataInputs = ref({});
const detailInputs = ref({});
const metadataImage = ref(undefined);
const inputsErrors = ref({});
const metadataInputsErrors = ref({});
const detailsInputsErrors = ref({});
const errors = ref(undefined);

const callResult = ref(undefined);
const callError = ref(undefined);
const isLoading = ref(false);

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const callMethod = () => {
    // Perform all validations before calling the method
    const hasError = performValidations();
    // Call methods
    if (!hasError) {
        errors.value = undefined;
        // If minting call
        if (props.isMint) {
            handleMintCall(route.params.id);
        }
        // All other calls
        else {
            handleMethodCall(route.params.id);
        }
    }
};

const handleMintCall = (contractId) => {
    isLoading.value = true;
    // Create the form data object
    const apiData = new FormData();
    // Required data
    apiData.append('methodId', props.method._id);
    // Inputs
    apiData.append('inputs', JSON.stringify(inputs.value));
    // Metadata
    if (props.metadata) apiData.append('metadata', JSON.stringify({
        ...detailInputs.value,
        attributes: {
            ...metadataInputs.value
        }
    }));
    if (props.metadata.hasImage) apiData.append('token', metadataImage.value);
    // Send the request
    api.mintWithContract(contractId, apiData)
        .then((res) => {
            callResult.value = res.data.result;
            callError.value = undefined;
            isLoading.value = false;
        })
        .catch((err) => {
            if (err.response && err.response.status === 400) {
                callError.value = err.response.data.message;
            } else {
                callError.value = 'Internal error';
            }
            callResult.value = undefined;
            isLoading.value = false;
        });
};

const handleMethodCall = (contractId) => {
    isLoading.value = true;
    api.interactWithContract(contractId, props.method._id, inputs.value)
        .then((res) => {
            callResult.value = res.data.result;
            callError.value = undefined;
            isLoading.value = false;
        })
        .catch((err) => {
            if (err.response && err.response.status === 400) {
                callError.value = err.response.data.message;
            } else {
                callError.value = 'Internal error';
            }
            callResult.value = undefined;
            isLoading.value = false;
        });
};

// Performs all input validations
const performValidations = () => {
    // Validate inputs
    let hasError = false;
    // Normal inputs verification
    props.method.inputs.forEach((input) => {
        // Don't evaluate uri method
        if (!props.metadata || !isUriField(input)) {
            // Check if the input is empty, cannot bypass this one, in case the user directly calls the method without touching the inputs
            if (
                !(
                    input.name in inputs.value &&
                    inputs.value[input.name] !== '' &&
                    inputs.value[input.name] !== null &&
                    inputs.value[input.name] !== undefined
                )
            ) {
                hasError = hasError || true;
                errors.value = t('interact.error.missingParameter', [input.name, input.type]);
            }
            // Verify with the emitted errors from the inputs
            else if (inputsErrors.value[input.name] !== undefined) {
                hasError = hasError || true;
                errors.value = `${t(inputsErrors.value[input.name])} - ${input.name}`;
            }
        }
    });
    // Metadata verification
    if (props.metadata) {
        // Verify attributes
        props.metadata.attributes.forEach((metadataField) => {
            // Check if the input is empty, cannot bypass this one, in case the user directly calls the method without touching the inputs
            if (
                !(
                    metadataField.traitType in metadataInputs.value &&
                    metadataInputs.value[metadataField.traitType] !== '' &&
                    metadataInputs.value[metadataField.traitType] !== null &&
                    metadataInputs.value[metadataField.traitType] !== undefined
                )
            ) {
                hasError = hasError || true;
                errors.value = t('interact.error.missingParameter', [
                    metadataField.traitType,
                    t(`inputs.text.${metadataField.displayType ? metadataField.displayType : metadataField.traitFormat}`)
                ]);
            }
            // Verify with the emitted errors from the inputs
            else if (metadataInputsErrors.value[metadataField.traitType] !== undefined) {
                hasError = hasError || true;
                errors.value = `${t(metadataInputsErrors.value[metadataField.traitType])} - ${t(`inputs.text.${metadataField.displayType ? metadataField.displayType : metadataField.traitFormat}`)}`;
            }
        });
        // Verify image is there
        if (props.metadata.hasImage && !metadataImage.value) {
            hasError = true;
            errors.value = t('interact.error.missingImage');
        }
        // Verify name & description
        // Check if the input is empty, cannot bypass this one, in case the user directly calls the method without touching the inputs
        if (
            !(
                'name' in detailInputs.value &&
                detailInputs.value['name'] !== '' &&
                detailInputs.value['name'] !== null &&
                detailInputs.value['name'] !== undefined
            )
        ) {
            hasError = hasError || true;
            errors.value = t('interact.error.missingParameter', ['name', t(`inputs.text.string`)]);
        }
        // Verify with the emitted errors from the inputs
        else if (detailsInputsErrors.value['name'] !== undefined) {
            hasError = hasError || true;
            errors.value = `${t(detailsInputsErrors.value['name'])} - ${t(`inputs.text.string`)}`;
        }
        if (
            !(
                'description' in detailInputs.value &&
                detailInputs.value['description'] !== '' &&
                detailInputs.value['description'] !== null &&
                detailInputs.value['description'] !== undefined
            )
        ) {
            hasError = hasError || true;
            errors.value = t('interact.error.missingParameter', ['description', t(`inputs.text.long_string`)]);
        }
        // Verify with the emitted errors from the inputs
        else if (detailsInputsErrors.value['description'] !== undefined) {
            hasError = hasError || true;
            errors.value = `${t(detailsInputsErrors.value['description'])} - ${t(`inputs.text.long_string`)}`;
        }
    }
    return hasError;
};

// Handle updating the inner error storage for each input
const handleValidInput = (name) => {
    inputsErrors.value[name] = undefined;
};

const handleInvalidInput = (name, error) => {
    inputsErrors.value[name] = error;
};

const handleValidMetadataInput = (name) => {
    metadataInputsErrors.value[name] = undefined;
};

const handleInvalidMetadataInput = (name, error) => {
    metadataInputsErrors.value[name] = error;
};

const handleValidDetailsInput = (name) => {
    detailsInputsErrors.value[name] = undefined;
};

const handleInvalidDetailsInput = (name, error) => {
    detailsInputsErrors.value[name] = error;
};

// Determine if the field is an URI field
const isUriField = (field) => {
    return field.name === 'uri';
};

const getHelp = () => {
    router.push({
        hash: `#${props.method.name}`
    });
};

const copyResponse = (response) => {
    if (!navigator.clipboard) {
        setSnackbar('Cannot copy response to clipboard!', 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(response)
        .then(() => {
            setSnackbar('Copied to clipboard!', 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar('Cannot copy response to clipboard!', 'error', 5);
        });
};
</script>
