<template>
    <div class="bg-light pt-sm rounded-md shadow-lg border border-gray-200">
        <!-- <h2 class="text-center text-brand_secondary">{{$t('editor.contract.features')}}</h2> -->
        <div class="divide-y divide-typography_secondary px-sm">
            <div class="pb-sm">
                <h5 class="form--title">{{ $t('editor.contract.information') }}<QuestionMarkCircleIcon class="form--title-icon" /></h5>
                <div class="flex flex-col justify-between">
                    <!-- Set validations for each field and the validation events -->
                    <v-input
                        id="name"
                        name="name"
                        format="primary-white"
                        placeholder="SmartNFT..."
                        :validations="['required', 'name']"
                        label="Contract Name"
                        v-model="contractData.name"
                        class="w-full pb-2"
                        @validInput="() => handleValidInput('name')"
                        @invalidInput="(error) => handleInvalidInput('name', error)"
                    />
                    <v-input
                        id="symbol"
                        name="symbol"
                        format="primary-white"
                        placeholder="SNFT..."
                        :validations="['required', 'symbol']"
                        label="Contract Symbol"
                        v-model="contractData.symbol"
                        class="w-full pt-2"
                        @validInput="() => handleValidInput('symbol')"
                        @invalidInput="(error) => handleInvalidInput('symbol', error)"
                    />
                </div>
            </div>
            <div class="py-sm">
                <h5 class="form--title">{{ $t('editor.contract.creation') }} <QuestionMarkCircleIcon class="form--title-icon" /></h5>
                <v-checkbox
                    id="isMintable"
                    name="isMintable"
                    placeholder="Mintable"
                    label="Mintable"
                    v-model="contractData.isMintable"
                    class="w-full md:w-6/12"
                />
                <div class="flex flex-row">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <v-checkbox
                        id="isAutoIncrementIds"
                        name="isAutoIncrementIds"
                        placeholder="Auto Increment IDs"
                        label="Auto Increment IDs"
                        v-model="contractData.isAutoIncrementIds"
                    />
                </div>
                <v-checkbox
                    id="isPausable"
                    name="isPausable"
                    placeholder="Pausable"
                    label="Pausable"
                    v-model="contractData.isPausable"
                    class="w-full md:w-6/12"
                />
                <v-checkbox
                    id="isBurnable"
                    name="isBurnable"
                    placeholder="Burnable"
                    label="Burnable"
                    v-model="contractData.isBurnable"
                    class="w-full md:w-6/12"
                />
                <v-checkbox
                    id="isEnumerable"
                    name="isEnumerable"
                    placeholder="Enumerable"
                    label="Enumerable"
                    v-model="contractData.isEnumerable"
                    class="w-full md:w-6/12"
                />
                <div class="flex flex-row">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <v-checkbox
                        id="isLimitSupply"
                        name="isLimitSupply"
                        placeholder="Limit Supply"
                        label="Limit Supply"
                        v-model="contractData.isLimitSupply"
                    />
                </div>
                <v-checkbox
                    id="isURIStorage"
                    name="isURIStorage"
                    placeholder="URIStorage"
                    label="URIStorage"
                    v-model="contractData.isURIStorage"
                    class="w-full md:w-6/12"
                />
                <div class="flex flex-row">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <v-checkbox
                        id="isUniqueStorage"
                        name="isUniqueStorage"
                        placeholder="Unique Storage"
                        label="Unique Storage"
                        v-model="contractData.isUniqueStorage"
                    />
                </div>
            </div>
            <div v-if="contractData.isURIStorage" class="py-sm">
                <h5 class="form--title">{{ $t('editor.contract.metadata') }} <QuestionMarkCircleIcon class="form--title-icon" /></h5>
                <p class="text-xl text-brand_secondary">Image</p>
                <v-checkbox
                    id="hasImage"
                    name="hasImage"
                    placeholder="Has Image?"
                    :label="$t('editor.contract.hasImage')"
                    v-model="contractData.hasImage"
                    class="w-full md:w-6/12"
                />
                <p class="text-xl text-brand_secondary mt-sm">Fields</p>
                <v-metadata v-model="contractData.metadata" />
                <p class="mt-xs text-body_xs"><strong>Note:</strong> By default, all tokens have name & description</p>
            </div>
        </div>
        <!-- ACTIONS -->
        <div class="flex flex-col sm:flex-row items-center justify-center py-xs px-sm mt-sm">
            <v-button
                v-if="props.canDeploy"
                :format="isLoading ? 'disabled' : 'secondary'"
                aria="Deploy the NFT contract"
                :external="false"
                :white="false"
                size="medium"
                :loading="isLoading"
                :disabled="isLoading"
                :text="$t('editor.buttons.deploy').toUpperCase()"
                class="editor--button"
                @click="isLoading ? undefined : deployContract()"
            />
            <v-button
                v-if="!props.isVerified && props.canVerify"
                :format="isLoading ? 'disabled' : 'secondary'"
                aria="Verify the NFT contract"
                :external="false"
                :white="false"
                size="medium"
                :loading="isLoading"
                :disabled="isLoading"
                :text="$t('editor.buttons.verify').toUpperCase()"
                class="editor--button"
                @click="isLoading ? undefined : verifyContract()"
            />
        </div>
        <div :class="['flex flex-row items-center justify-center relative border-t py-xs mt-sm border-gray-600', isExpanded ? 'border-b' : '']">
            <slot name="expandableHead" />
            <ChevronUpIcon
                :class="[
                    'w-10 h-10 text-typography_secondary transform duration-200 cursor-pointer absolute right-0 mr-xs',
                    isExpanded ? 'rotate-0' : 'rotate-180'
                ]"
                @click="toggleExpanded"
            />
        </div>
        <div v-if="isExpanded" class="px-sm py-xs md:py-sm flex flex-col">
            <slot name="expandableContent" />
        </div>
    </div>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vMetadata from '@/components/editor/metadata/metadata.vue';
import vCheckbox from '@/components/editor/checkbox.vue';
import { QuestionMarkCircleIcon, ChevronUpIcon } from '@heroicons/vue/solid';
import { ref, watch, computed } from 'vue';
import { mapApiExtensionsToForm, mapApiMetadataToForm } from '@/js/mapper.js';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const props = defineProps({
    name: {
        type: String,
        default: undefined
    },
    symbol: {
        type: String,
        default: undefined
    },
    extensions: {
        type: Array,
        default: []
    },
    metadata: {
        type: Object,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    canVerify: {
        type: Boolean,
        default: false
    },
    canDeploy: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: undefined
    }
});

// Get a mapped version of the extension to see which one is enabled
const mappedExtensions = mapApiExtensionsToForm(props.extensions);
const [hasImage, mappedMetadata] = mapApiMetadataToForm(props.metadata);
const contractData = ref({
    name: props.name,
    symbol: props.symbol,
    isMintable: mappedExtensions.isMintable ?? false,
    isPausable: mappedExtensions.isPausable ?? false,
    isBurnable: mappedExtensions.isBurnable ?? false,
    isAutoIncrementIds: mappedExtensions.isAutoIncrementIds ?? false,
    isEnumerable: mappedExtensions.isEnumerable ?? false,
    isLimitSupply: mappedExtensions.isLimitSupply ?? false,
    isURIStorage: mappedExtensions.isURIStorage ?? false,
    isUniqueStorage: mappedExtensions.isUniqueStorage ?? false,
    hasImage: hasImage ?? true,
    metadata: mappedMetadata ?? []
});
const inputsErrors = ref({});
const isLoading = ref(false);

const emit = defineEmits(['contractChanged', 'verifyContract', 'deployContract']);
const deployContract = () => {
    isLoading.value = true;
    recaptcha.challengeInput('DEPLOY_CONTRACT', api, (recaptchaResponse) => {
        if (recaptchaResponse.data.success) {
            emit('deployContract');
            isLoading.value = false;
        } else {
            setSnackbar('You are not human, cannot use this!', 'error', 5);
            isLoading.value = false;
        }
    });
};
const verifyContract = () => {
    emit('verifyContract');
};

// Error handling
const handleValidInput = (name) => {
    inputsErrors.value[name] = undefined;
};

const handleInvalidInput = (name, error) => {
    inputsErrors.value[name] = error;
};

const validMetadata = computed(() => {
    return contractData.value.metadata.filter((field) => field.name === '' || field.name === null || field.name === undefined).length === 0;
});
watch(
    () => contractData.value,
    () => {
        // Need to verify that both are selected not to emit a fake event
        if (
            ((contractData.value.isAutoIncrementIds && contractData.value.isMintable) || !contractData.value.isAutoIncrementIds) &&
            ((contractData.value.isLimitSupply && contractData.value.isEnumerable) || !contractData.value.isLimitSupply) &&
            ((contractData.value.isUniqueStorage && contractData.value.isURIStorage) || !contractData.value.isUniqueStorage) &&
            validMetadata.value
        ) {
            // Don't send the update event if the name or symbol are invalid
            if (!inputsErrors.value['name'] && !inputsErrors.value['symbol']) {
                emit('contractChanged', contractData.value);
            }
        }
    },
    { deep: true }
);
watch(
    () => contractData.value.isAutoIncrementIds,
    () => {
        if (contractData.value.isAutoIncrementIds) {
            contractData.value.isMintable = true;
        }
    }
);
watch(
    () => contractData.value.isMintable,
    () => {
        if (!contractData.value.isMintable) {
            contractData.value.isAutoIncrementIds = false;
        }
    }
);
watch(
    () => contractData.value.isUniqueStorage,
    () => {
        if (contractData.value.isUniqueStorage) {
            contractData.value.isURIStorage = true;
        }
    }
);
watch(
    () => contractData.value.isURIStorage,
    () => {
        if (!contractData.value.isURIStorage) {
            contractData.value.isUniqueStorage = false;
        }
    }
);
watch(
    () => contractData.value.isLimitSupply,
    () => {
        if (contractData.value.isLimitSupply) {
            contractData.value.isEnumerable = true;
        }
    }
);
watch(
    () => contractData.value.isEnumerable,
    () => {
        if (!contractData.value.isEnumerable) {
            contractData.value.isLimitSupply = false;
        }
    }
);
// Expandable section
const isExpanded = ref(false);
const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};
</script>

<style>
.form--title {
    @apply text-brand_secondary flex items-center mb-xs;
}

.form--title-icon {
    @apply h-6 w-6 text-brand_tertiary ml-xs;
}

.editor--button {
    @apply sm:ml-sm sm:mt-0;
}

@screen sm {
    .editor--button:not(:first-of-type):not(:last-of-type) {
        @apply mx-sm mt-0;
    }
    
    .editor--button:first-of-type {
        @apply mr-sm mt-0;
    }
    
    .editor--button:last-of-type {
        @apply ml-sm mt-0;
    }
}
</style>
