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
                        <v-input
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
                        <p v-if="props.metadata.attributes.length > 0" class="text-lg mt-sm">Fields</p>
                        <template v-for="(metadataField, index) in props.metadata.attributes" :key="index">
                            <v-input
                                :id="`${props.method.name}-metadata-${metadataField.trait_type}`"
                                :name="`metadata-${metadataField.trait_type}`"
                                :label="`${metadataField.trait_type} (${metadataField.trait_format}${
                                    metadataField.display_type ? ' - ' + $t(`inputs.text.${metadataField.display_type}`) : ''
                                })`"
                                :hideLabel="false"
                                :placeholder="
                                    $t(getParameterPlaceholder(metadataField.display_type ? metadataField.display_type : metadataField.trait_format))
                                "
                                v-model="metadataInputs[metadataField.trait_type]"
                                :continuousInput="false"
                                :validations="
                                    metadataField.display_type
                                        ? ['required', metadataField.trait_format, metadataField.display_type]
                                        : ['required', metadataField.trait_format]
                                "
                                @validInput="() => handleValidMetadataInput(metadataField.trait_type)"
                                @invalidInput="(error) => handleInvalidMetadataInput(metadataField.trait_type, error)"
                                format="primary-white"
                                class="mb-xs"
                            />
                        </template>
                    </div>
                </template>
                <template v-if="callResult || callError">
                    <div :class="[props.metadata || props.method.inputs && props.method.inputs.length > 0 ? 'mt-sm pt-sm' : '']">
                        <p class="text-h5">Result</p>
                        <div class="w-full bg-white rounded-md p-xs mt-sm pr-lg relative">
                            <p v-if="callResult" class="text-typography_secondary">{{callResult}}</p>
                            <p v-if="callError" class="text-error">{{callError}}</p>
                            <div class="absolute right-0 top-0 text-black hover:text-brand_secondary hover:bg-brand_primary cursor-pointer p-1 border border-black rounded-md transition duration-200" @click="() => copyResponse(callResult || callError)">
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
const metadataImage = ref(undefined);
const inputsErrors = ref({});
const metadataInputsErrors = ref({});
const errors = ref(undefined);

const callResult = ref(undefined);
const callError = ref(undefined);
const isLoading = ref(false);

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import {useRoute, useRouter} from 'vue-router';
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

//

const handleMintCall = (contractId) => {};

const handleMethodCall = (contractId) => {
    isLoading.value = true;
    api.interactWithContract(contractId, props.method._id, inputs.value)
        .then((res) => {
            isLoading.value = false;
            callResult.value = res.data.result;
            callError.value = undefined;
            console.log(res);
        })
        .catch((err) => {
            isLoading.value = false;
            console.log("ERROR");
            console.log(err);
            callError.value = 'INTERNAL ERROR'
            callResult.value = undefined;
            // setSnackbar("Contract doesn't exist!", 'error', 5);
        });
};

// Performs all input validations
const performValidations = () => {
    // Validate inputs
    let hasError = false;
    // Normal inputs verification
    props.method.inputs.forEach((input) => {
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
    });
    // Metadata verification
    if (props.metadata) {
        // Verify attributes
        props.metadata.attributes.forEach((metadataField) => {
            // Check if the input is empty, cannot bypass this one, in case the user directly calls the method without touching the inputs
            if (
                !(
                    metadataField.trait_type in metadataInputs.value &&
                    metadataInputs.value[metadataField.trait_type] !== '' &&
                    metadataInputs.value[metadataField.trait_type] !== null &&
                    metadataInputs.value[metadataField.trait_type] !== undefined
                )
            ) {
                hasError = hasError || true;
                errors.value = t('interact.error.missingParameter', [
                    metadataField.trait_type,
                    metadataField.trait_type ? metadataField.trait_type : metadataField.trait_format
                ]);
            }
            // Verify with the emitted errors from the inputs
            else if (metadataInputsErrors.value[metadataField.trait_type] !== undefined) {
                hasError = hasError || true;
                errors.value = `${t(metadataInputsErrors.value[metadataField.trait_type])} - ${metadataField.trait_type}`;
            }
        });
        // Verify image is there
        if (props.metadata.hasImage && !metadataImage.value) {
            hasError = true;
            errors.value = t('interact.error.missingImage');
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
