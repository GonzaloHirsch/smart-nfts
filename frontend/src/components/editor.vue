<template>
    <div class="bg-light pt-sm rounded-md shadow-lg border border-gray-200 relative">
        <div class="divide-y divide-typography_secondary px-sm">
            <div class="pb-sm relative">
                <div v-if="props.isLoading" class="editor--blocker-panel"></div>
                <h5 class="form--title">
                    {{ $t('editor.contract.information') }}<QuestionMarkCircleIcon class="form--title-icon" @click="getHelp('contractInformation')" />
                </h5>
                <div class="flex flex-col justify-between">
                    <!-- Set validations for each field and the validation events -->
                    <v-input
                        id="name"
                        name="name"
                        format="primary-white"
                        :placeholder="$t('inputs.placeholder.contractName')"
                        :validations="['required', 'name']"
                        :label="$t('inputs.text.contractName')"
                        v-model="contractData.name"
                        class="w-full pb-2"
                        @validInput="() => handleValidInput('name', false)"
                        @invalidInput="(error) => handleInvalidInput('name', error, false)"
                    />
                    <v-input
                        id="symbol"
                        name="symbol"
                        format="primary-white"
                        :placeholder="$t('inputs.placeholder.contractSymbol')"
                        :validations="['required', 'symbol']"
                        :label="$t('inputs.text.contractSymbol')"
                        v-model="contractData.symbol"
                        class="w-full pt-2"
                        @validInput="() => handleValidInput('symbol', false)"
                        @invalidInput="(error) => handleInvalidInput('symbol', error, false)"
                    />
                </div>
            </div>
            <div class="py-sm relative">
                <div v-if="props.isLoading" class="editor--blocker-panel"></div>
                <h5 class="form--title">
                    {{ $t('editor.contract.creation') }} <QuestionMarkCircleIcon class="form--title-icon" @click="getHelp('creation')" />
                </h5>
                <div class="flex">
                    <v-checkbox
                        id="isMintable"
                        name="isMintable"
                        :placeholder="$t('inputs.text.extensions.mintable')"
                        :label="$t('inputs.text.extensions.mintable')"
                        v-model="contractData.isMintable"
                    /><QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('mintable')" />
                </div>
                <div class="flex">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <v-checkbox
                        id="isAutoIncrementIds"
                        name="isAutoIncrementIds"
                        class="my-1"
                        :placeholder="$t('inputs.text.extensions.autoincrementId')"
                        :label="$t('inputs.text.extensions.autoincrementId')"
                        v-model="contractData.isAutoIncrementIds"
                    /><QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('autoincrementIds')" />
                </div>
                <div class="flex">
                    <v-checkbox
                        id="isPausable"
                        name="isPausable"
                        :placeholder="$t('inputs.text.extensions.pausable')"
                        :label="$t('inputs.text.extensions.pausable')"
                        v-model="contractData.isPausable"
                    />
                    <QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('pausable')" />
                </div>
                <div class="flex">
                    <v-checkbox
                        id="isBurnable"
                        name="isBurnable"
                        :placeholder="$t('inputs.text.extensions.burnable')"
                        :label="$t('inputs.text.extensions.burnable')"
                        v-model="contractData.isBurnable"
                    /><QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('burnable')" />
                </div>
                <div class="flex">
                    <v-checkbox
                        id="isEnumerable"
                        name="isEnumerable"
                        :placeholder="$t('inputs.text.extensions.enumerable')"
                        :label="$t('inputs.text.extensions.enumerable')"
                        v-model="contractData.isEnumerable"
                    />
                    <QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('enumerable')" />
                </div>
                <div class="flex">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <div class="flex flex-col">
                        <div class="flex my-1">
                            <v-checkbox
                                id="isLimitSupply"
                                name="isLimitSupply"
                                :placeholder="$t('inputs.text.extensions.limitSupply.name')"
                                :label="$t('inputs.text.extensions.limitSupply.name')"
                                v-model="contractData.isLimitSupply"
                            />
                            <QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('limitedSupply')" />
                        </div>
                        <v-input
                            v-if="contractData.isLimitSupply"
                            id="supply"
                            name="supply"
                            format="primary-white"
                            :placeholder="$t('inputs.placeholder.uint256')"
                            :validations="['required', 'uint256']"
                            :label="$t('inputs.text.extensions.limitSupply.count')"
                            v-model="contractData.extensionInputs.maxSupply"
                            class="w-full mb-1"
                            @validInput="() => handleValidInput('maxSupply', true)"
                            @invalidInput="(error) => handleInvalidInput('maxSupply', error, true)"
                        />
                    </div>
                </div>
                <div class="flex">
                    <v-checkbox
                        id="isURIStorage"
                        name="isURIStorage"
                        :placeholder="$t('inputs.text.extensions.uriStorage')"
                        :label="$t('inputs.text.extensions.uriStorage')"
                        v-model="contractData.isURIStorage"
                    />
                    <QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('uriStorage')" />
                </div>
                <div class="flex">
                    <span class="border-l-2 border-black mx-xs"></span>
                    <v-checkbox
                        id="isUniqueStorage"
                        name="isUniqueStorage"
                        class="my-1"
                        :placeholder="$t('inputs.text.extensions.uniqueStorage')"
                        :label="$t('inputs.text.extensions.uniqueStorage')"
                        v-model="contractData.isUniqueStorage"
                    /><QuestionMarkCircleIcon class="form--field-icon" @click="getHelp('uniqueStorage')" />
                </div>
            </div>
            <div v-if="contractData.isURIStorage" class="py-sm">
                <h5 class="form--title">
                    {{ $t('editor.contract.metadata') }}
                    <QuestionMarkCircleIcon class="form--title-icon" @click="getHelp('metadata')" />
                </h5>
                <p class="text-xl text-brand_secondary">{{ $t('editor.metadata.image') }}</p>
                <v-checkbox
                    id="hasImage"
                    name="hasImage"
                    :placeholder="$t('inputs.text.extensions.metadata.image')"
                    :label="$t('editor.contract.hasImage')"
                    v-model="metadataData.hasImage"
                    class="w-full md:w-6/12"
                />
                <p class="text-xl text-brand_secondary mt-sm">{{ $t('editor.metadata.fields') }}</p>
                <v-metadata v-model="metadataData.metadata" />
                <p class="mt-xs text-body_xs" v-html="$t('editor.metadata.note')"></p>
            </div>
        </div>
        <!-- ACTIONS -->
        <div class="flex flex-row items-center justify-center py-xs px-sm mt-sm">
            <v-button
                v-if="props.canDeploy"
                :format="isLoading ? 'disabled' : 'secondary'"
                :aria="$t('editor.buttons.deploy.aria')"
                :external="false"
                :white="false"
                size="medium"
                :loading="isLoading"
                :disabled="isLoading"
                :text="$t('editor.buttons.deploy.text').toUpperCase()"
                class="editor--button"
                @click="isLoading ? undefined : deployContract()"
            />
            <v-button
                v-if="!props.isVerified && props.canVerify"
                :format="isLoading ? 'disabled' : 'secondary'"
                :aria="$t('editor.buttons.verify.aria')"
                :external="false"
                :white="false"
                size="medium"
                :loading="isLoading"
                :disabled="isLoading"
                :text="$t('editor.buttons.verify.text').toUpperCase()"
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
                :aria-label="isExpanded ? $t('editor.buttons.expand.ariaContract') : $t('editor.buttons.expand.ariaExpand')"
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
import { mapApiExtensionsToForm, mapExtensionInputsToForm, mapApiMetadataToForm } from '@/js/mapper.js';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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
    extensionInputs: {
        type: Object,
        default: {}
    },
    metadata: {
        type: Object,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLoading: {
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
const mappedInputs = mapExtensionInputsToForm(props.extensionInputs);
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
    extensionInputs: mappedInputs || {
        maxSupply: 10
    }
});
const metadataData = ref({
    metadata: mappedMetadata ?? [],
    hasImage: hasImage ?? true
});
const inputsErrors = ref({});
const extensionInputsErrors = ref({});
const isLoading = ref(false);

const emit = defineEmits(['contractChanged', 'metadataChanged', 'verifyContract', 'deployContract']);
const deployContract = () => {
    emit('deployContract');
};
const verifyContract = () => {
    emit('verifyContract');
};

// Error handling
const handleValidInput = (name, isExtensionInput) => {
    if (isExtensionInput) {
        extensionInputsErrors.value[name] = undefined;
    } else {
        inputsErrors.value[name] = undefined;
    }
};

const handleInvalidInput = (name, error, isExtensionInput) => {
    if (isExtensionInput) {
        extensionInputsErrors.value[name] = error;
    } else {
        inputsErrors.value[name] = error;
    }
};

const validMetadata = computed(() => {
    return metadataData.value.metadata.filter((field) => field.name === '' || field.name === null || field.name === undefined).length === 0;
});
const validState = () => {
    if (
        ((contractData.value.isAutoIncrementIds && contractData.value.isMintable) || !contractData.value.isAutoIncrementIds) &&
        ((contractData.value.isLimitSupply &&
            contractData.value.isEnumerable &&
            contractData.value.extensionInputs.maxSupply !== null &&
            contractData.value.extensionInputs.maxSupply !== undefined &&
            contractData.value.extensionInputs.maxSupply !== '') ||
            !contractData.value.isLimitSupply) &&
        ((contractData.value.isUniqueStorage && contractData.value.isURIStorage) || !contractData.value.isUniqueStorage) &&
        validMetadata.value
    ) {
        // Don't send the update event if the name or symbol are invalid
        if (
            !inputsErrors.value['name'] &&
            !inputsErrors.value['symbol'] &&
            (!extensionInputsErrors.value['maxSupply'] || !contractData.value.isLimitSupply)
        ) {
            return true;
        }
    }
    return false;
};
watch(
    () => contractData.value,
    () => {
        if (validState()) {
            emit('contractChanged', contractData.value, metadataData.value);
        }
    },
    { deep: true }
);
watch(
    () => metadataData.value,
    () => {
        if (validState()) {
            emit('metadataChanged', contractData.value, metadataData.value);
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

const getHelp = (hash) => {
    router.push({
        hash: `#${hash}`
    });
};

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
    @apply h-6 w-6 text-brand_tertiary ml-xs cursor-pointer;
}

.form--field-icon {
    @apply h-5 w-5 text-brand_tertiary ml-xs my-auto cursor-pointer;
}

.editor--button:not(:first-of-type):not(:last-of-type) {
    @apply mx-sm mt-0;
}

.editor--button:first-of-type {
    @apply mr-sm mt-0;
}

.editor--button:last-of-type {
    @apply ml-sm mt-0;
}

.editor--blocker-panel {
    @apply absolute top-0 left-0 bg-light/50 z-10 w-full h-full;
}
</style>
