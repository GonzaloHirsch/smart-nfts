<template>
    <div class="bg-light p-sm rounded-md shadow-lg border border-gray-200">
        <h2 class="text-center text-brand_secondary">{{$t('editor.contract.features')}}</h2>
        <div class="divide-y divide-typography_secondary">
            <div class="form--section">
                <h5 class="form--title">{{$t('editor.contract.information')}}<QuestionMarkCircleIcon class="form--title-icon" /></h5>
                <div class="flex flex-col md:flex-row justify-between">
                    <!-- Set validations for each field and the validation events -->
                    <v-input
                        id="name"
                        name="name"
                        format="primary-white"
                        placeholder="SmartNFT..."
                        :validations="['required', 'name']"
                        label="Contract Name"
                        v-model="contractData.name"
                        class="w-full pb-2 md:w-6/12 md:pr-2 md:py-0"
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
                        class="w-full pt-2 md:w-6/12 md:pl-2 md:py-0"
                        @validInput="() => handleValidInput('symbol')"
                        @invalidInput="(error) => handleInvalidInput('symbol', error)"
                    />
                </div>
            </div>
            <div class="form--section">
                <h5 class="form--title">{{$t('editor.contract.creation')}} <QuestionMarkCircleIcon class="form--title-icon" /></h5>
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
                <v-checkbox id="isEnumerable" name="isEnumerable" placeholder="Enumerable" label="Enumerable" v-model="contractData.isEnumerable" class="w-full md:w-6/12" />
                <v-checkbox
                    id="isURIStorage"
                    name="isURIStorage"
                    placeholder="URIStorage"
                    label="URIStorage"
                    v-model="contractData.isURIStorage"
                    class="w-full md:w-6/12"
                />
            </div>
            <div v-if="contractData.isURIStorage" class="form--section">
                <h5 class="form--title">{{$t('editor.contract.metadata')}} <QuestionMarkCircleIcon class="form--title-icon" /></h5>
                <p><strong>Note:</strong> By default, all tokens have name & description</p>
                <p class="text-xl text-brand_secondary mt-sm">Image</p>
                <v-checkbox
                    id="hasImage"
                    name="hasImage"
                    placeholder="Has Image?"
                    :label="$t('editor.contract.hasImage')"
                    v-model="contractData.hasImage"
                    class="w-full md:w-6/12"
                />
                <p class="text-xl text-brand_secondary mt-sm">Fields</p>
                <v-metadata v-model="contractData.metadata"/>
            </div>
        </div>
        <!-- ACTIONS -->
        <div class="flex flex-col sm:flex-row items-center justify-center">
            <v-button
                v-if="props.canDeploy"
                format="primary"
                aria="Deploy the NFT contract"
                :external="false"
                :white="false"
                size="large"
                sizeMobile="medium"
                :text="$t('editor.buttons.deploy').toUpperCase()"
                class="mt-sm sm:ml-sm sm:mt-0"
                @click="deployContract"
            />
            <v-button
                v-if="!props.isVerified && props.canVerify"
                format="primary"
                aria="Verify the NFT contract"
                :external="false"
                :white="false"
                size="large"
                sizeMobile="medium"
                :text="$t('editor.buttons.verify').toUpperCase()"
                class="mt-sm sm:ml-sm sm:mt-0"
                @click="verifyContract"
            />
            <v-button
                v-if="props.canDownload"
                :format="props.loadingDownload ? 'disabled' : 'primary'"
                :disabled="props.loadingDownload"
                :loading="props.loadingDownload"
                aria="Download your NFT contract"
                :external="false"
                :white="false"
                size="large"
                sizeMobile="medium"
                :text="$t('editor.buttons.download').toUpperCase()"
                class="mt-sm sm:ml-sm sm:mt-0"
                @click="downloadContract"
            />
        </div>
        <slot />
    </div>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vMetadata from '@/components/editor/metadata/metadata.vue';
import vCheckbox from '@/components/editor/checkbox.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import { ref, watch, computed } from 'vue';
import { mapApiExtensionsToForm, mapApiMetadataToForm } from '@/js/mapper.js';

import { useApi } from '@/plugins/api';
const api = useApi();

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
    canDownload: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: undefined
    },
    loadingDownload: {
        type: Boolean,
        default: false
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
    isURIStorage: mappedExtensions.isURIStorage ?? false,
    hasImage: hasImage ?? true,
    metadata: mappedMetadata ?? []
});
const inputsErrors = ref({});

const emit = defineEmits(['contractChanged', 'verifyContract', 'deployContract', 'downloadContract']);
const deployContract = () => {
    emit('deployContract');
};
const verifyContract = () => {
    emit('verifyContract');
};
const downloadContract = () => {
    emit('downloadContract');
};

// Error handling
const handleValidInput = (name) => {
    inputsErrors.value[name] = undefined;
};

const handleInvalidInput = (name, error) => {
    inputsErrors.value[name] = error;
};

const validMetadata = computed(() => {
    return contractData.value.metadata.filter(field => field.name === '' || field.name === null || field.name === undefined).length === 0;
});
watch(
    () => contractData.value,
    () => {
        // Need to verify that both are selected not to emit a fake event
        console.log(contractData.value, validMetadata.value);
        if (((contractData.value.isAutoIncrementIds && contractData.value.isMintable) || !contractData.value.isAutoIncrementIds) && validMetadata.value) {
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
</script>

<style>
.form--title {
    @apply text-brand_secondary flex items-center;
}

.form--title-icon {
    @apply h-6 w-6 text-brand_tertiary ml-xs;
}

.form--section {
    @apply py-sm;
}
</style>
