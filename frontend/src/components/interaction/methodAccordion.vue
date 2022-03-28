<template>
    <v-accordion :title="props.method.name" :format="props.format" :error="errors">
        <template #header>
            <!-- Icon for help -->
            <QuestionMarkCircleIcon class="w-6 h-6 md:w-7 md:h-7 text-brand_tertiary" @click.stop="getHelp" />
            <!-- Displaying the errors -->
            <v-button
                :format="isLoading ? 'disabled' : 'primary'"
                :disabled="isLoading"
                :loading="isLoading"
                :aria="$t('interact.buttons.execute.aria', [props.method.name])"
                :external="false"
                :white="false"
                size="xsmall"
                :text="$t('interact.buttons.execute.text').toUpperCase()"
                @click.native.stop="callMethod"
                class="ml-auto mr-xs my-auto"
            />
        </template>
        <template v-if="(props.method.inputs && props.method.inputs.length > 0) || callError || callResult || callResultType" #content>
            <div class="divide-y divide-white">
                <!-- Basic inputs -->
                <div v-if="props.method.inputs && props.method.inputs.length > 0">
                    <p class="text-h5">{{ $t('interact.methods.fields.parameters.title') }}</p>
                    <template v-for="(input, index) in props.method.inputs" :key="index">
                        <!-- Add the validations as the required one and the type check -->
                        <!-- Receive the events for input validity -->
                        <!-- Hide the uri field, we take care of that -->
                        <v-input
                            v-if="!props.metadata || !isRestrictiveField(input)"
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
                            class="mb-xs w-full"
                            :hasAutofill="input.type === 'address'"
                            :autofillHelp="$t('interact.methods.fields.copyAddress')"
                            :autofillValue="props.defaultAddress"
                        />
                    </template>
                </div>
                <template v-if="props.metadata">
                    <div class="mt-sm pt-sm">
                        <p class="text-h5">{{ $t('interact.methods.fields.metadata.title') }}</p>
                        <p v-if="props.metadata.hasImage" class="text-lg mt-sm">{{ $t('interact.methods.fields.metadata.image') }}</p>
                        <v-file-input v-if="props.metadata.hasImage" v-model="metadataImage"></v-file-input>
                        <p class="text-lg mt-sm">{{ $t('interact.methods.fields.metadata.details') }}</p>
                        <v-input
                            :id="`${props.method.name}-metadata-name`"
                            :name="`metadata-name`"
                            :label="$t('inputs.text.name')"
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
                            :label="$t('inputs.text.description')"
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
                        <p v-if="props.metadata.attributes.length > 0" class="text-lg mt-sm">{{ $t('interact.methods.fields.title') }}</p>
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
                <template v-if="callResult || callResultType || callError">
                    <div :class="[props.metadata || (props.method.inputs && props.method.inputs.length > 0) ? 'mt-sm pt-sm' : '']">
                        <p class="text-h5">{{ $t('interact.methods.result.title') }}</p>
                        <div class="w-full bg-white rounded-md p-xs mt-sm pr-base relative break-words">
                            <p v-if="(callResult || callResultType) && callHasSuccess" class="text-typography_secondary">
                                {{ callResultType === 'transactionHash' ? $t('interact.success.transactionDisplay', [callResult]) : callResult }}
                            </p>
                            <p v-if="!callHasSuccess" class="text-error">
                                {{ errorType === 'transaction' ? $t('interact.error.transactionDisplay', [callError]) : callError }}
                            </p>
                            <div
                                class="absolute right-0 top-0 text-black hover:text-brand_secondary hover:bg-brand_primary cursor-pointer p-1 border border-black rounded-md transition duration-200"
                                @click="() => copyResponse(callResult || callError)"
                                :aria-label="$t('interact.methods.result.copyResponse')"
                            >
                                <DocumentDuplicateIcon class="h-5 w-5" />
                            </div>
                        </div>
                        <p v-if="!callHasSuccess && callError && errorType === 'transaction'" class="mt-xs text-error text-sm">
                            {{ $t('interact.error.transactionMoreInfo') }}
                            <a
                                class="underline no-inherit text-sm"
                                :href="`https://${props.network}.etherscan.io/tx/${callError}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                :aria-label="$t('aria.exploreTransactionHash')"
                                >{{ callError }}</a
                            >
                        </p>
                        <p v-else-if="callHasSuccess && callResultType === 'transactionHash'" class="mt-xs text-white text-sm">
                            {{ $t('interact.error.transactionMoreInfo') }}
                            <a
                                class="underline no-inherit text-sm"
                                :href="`https://${props.network}.etherscan.io/tx/${callResult}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                :aria-label="$t('aria.exploreTransactionHash')"
                                >{{ callResult }}</a
                            >
                        </p>
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
    },
    network: {
        type: String,
        default: undefined
    },
    defaultAddress: {
        type: String,
        default: undefined
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

const callHasSuccess = ref(false);
const callResult = ref(undefined);
const callResultType = ref(undefined);
const callError = ref(undefined);
const errorType = ref(undefined);
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

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

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
    if (props.metadata)
        apiData.append(
            'metadata',
            JSON.stringify({
                ...detailInputs.value,
                attributes: {
                    ...metadataInputs.value
                }
            })
        );
    if (props?.metadata?.hasImage) apiData.append('token', metadataImage.value);
    recaptcha.challengeInput('MINT_WITH_CONTRACT', (token) => {
        // Send the request
        api.mintWithContract(contractId, apiData, token)
            .then((res) => {
                handleSuccessResults(res);
            })
            .catch((err) => {
                if (err?.response?.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 2.5);
                } else {
                    handleErrorResults(err);
                }
            });
    });
};

const handleMethodCall = (contractId) => {
    isLoading.value = true;
    recaptcha.challengeInput('CONTRACT_METHOD', (token) => {
        api.interactWithContract(contractId, props.method._id, inputs.value, token)
            .then((res) => {
                handleSuccessResults(res);
            })
            .catch((err) => {
                if (err?.response?.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 2.5);
                } else {
                    handleErrorResults(err);
                }
            });
    });
};

const handleSuccessResults = (res) => {
    callHasSuccess.value = true;
    callResult.value = res.data.result;
    callResultType.value = res.data.resultType;
    callError.value = undefined;
    errorType.value = undefined;
    isLoading.value = false;
};

const handleErrorResults = (err) => {
    callHasSuccess.value = false;
    if (err.response && err.response.status === 400) {
        if (err.response?.data?.data?.transactionHash) {
            errorType.value = 'transaction';
            callError.value = err.response?.data?.data?.transactionHash;
        } else {
            errorType.value = 'blockchain';
            callError.value = err.response?.data?.message;
        }
    } else {
        errorType.value = 'internal';
        callError.value = t('errors.internal');
    }
    callResult.value = undefined;
    callResultType.value = undefined;
    isLoading.value = false;
};

// Performs all input validations
const performValidations = () => {
    // Validate inputs
    let hasError = false;
    // Normal inputs verification
    props.method.inputs.forEach((input) => {
        // Don't evaluate uri method
        if (!props.metadata || !isRestrictiveField(input)) {
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
                errors.value = `${t(metadataInputsErrors.value[metadataField.traitType])} - ${t(
                    `inputs.text.${metadataField.displayType ? metadataField.displayType : metadataField.traitFormat}`
                )}`;
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

// Determine if the field must be restricted
const isRestrictiveField = (field) => {
    return field.name === 'uri' || field.name === 'hash';
};

const getHelp = () => {
    router.push({
        hash: `#${props.method.name}`
    });
};

const copyResponse = (response) => {
    if (!navigator.clipboard) {
        setSnackbar(t('errors.method.notCopyResponse'), 'error', 2.5);
        return;
    }
    navigator.clipboard
        .writeText(response)
        .then(() => {
            setSnackbar(t('success.copy'), 'default', 2.5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar(t('errors.method.notCopyResponse'), 'error', 2.5);
        });
};
</script>
