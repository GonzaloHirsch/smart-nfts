<template>
    <div>
        <h2 class="text-center text-brand_secondary">Features</h2>
        <div class="divide-y divide-typography_secondary">
            <div class="form--section">
                <h5 class="form--title">Contract Information <QuestionMarkCircleIcon class="form--title-icon" /></h5>
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
            <!-- <div class="form--section">
        <h5 class="form--title">Permissions <QuestionMarkCircleIcon class="form--title-icon" /></h5>
      </div> -->
            <div class="form--section">
                <h5 class="form--title">Creation <QuestionMarkCircleIcon class="form--title-icon" /></h5>
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
                    id="isURIStorage"
                    name="isURIStorage"
                    placeholder="URIStorage"
                    label="URIStorage"
                    v-model="contractData.isURIStorage"
                    class="w-full md:w-6/12"
                />
            </div>
            <!-- <div class="form--section">
        <h5 class="form--title">Metadata <QuestionMarkCircleIcon class="form--title-icon" /></h5>
      </div> -->
        </div>
        <!-- ACTIONS -->
        <div class="flex flex-col sm:flex-row items-center justify-center">
            <!-- <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" size="medium" :text="$t('editor.buttons.save').toUpperCase()" @click="saveContract" /> -->
            <v-button
                v-if="props.canDeploy"
                format="primary"
                aria="Deploy the NFT contract"
                :external="false"
                :white="false"
                size="medium"
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
                size="medium"
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
                size="medium"
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
import vCheckbox from '@/components/editor/checkbox.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import { ref, watch } from 'vue';
import { mapApiExtensionsToForm } from '@/js/mapper.js';

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
const contractData = ref({
    name: props.name,
    symbol: props.symbol,
    isMintable: mappedExtensions.isMintable ?? false,
    isPausable: mappedExtensions.isPausable ?? false,
    isBurnable: mappedExtensions.isBurnable ?? false,
    isAutoIncrementIds: mappedExtensions.isAutoIncrementIds ?? false,
    isURIStorage: mappedExtensions.isURIStorage ?? false
});
const inputsErrors = ref({});

const emit = defineEmits(['contractChanged', 'verifyContract', 'deployContract', 'downloadContract']);
const saveContract = () => {
    // api.saveContract('1234', contractData.value);
    console.log('DSAVE');
};
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

watch(
    () => contractData.value,
    () => {
        // Need to verify that both are selected not to emit a fake event
        if ((contractData.value.isAutoIncrementIds && contractData.value.isMintable) || !contractData.value.isAutoIncrementIds) {
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
