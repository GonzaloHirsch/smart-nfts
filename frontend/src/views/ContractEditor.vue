<template>
    <v-modal :showModal="isOpen" @close="handleModalClose">
        <template #title>
            <h3 v-if="modalType === 'deploy'" class="text-brand_secondary">Deploy Contract</h3>
            <h3 v-else-if="modalType === 'verify'" class="text-brand_secondary">Verify Contract</h3>
        </template>
        <template v-if="isLoadingModal">
            <div class="w-full rounded-lg text-brand_secondary">
                <h4 v-if="modalType === 'deploy'" class="flex items-center justify-center my-base py-xl">
                    {{ $t('editor.deploy.loading') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
                <h4 v-else-if="modalType === 'verify'" class="flex items-center justify-center my-base py-xl">
                    {{ $t('editor.verify.loading') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
            </div>
        </template>
        <template v-else>
            <p v-if="modalType === 'deploy'" class="break-words" v-html="$t('editor.deploy.message', [storedContract.deployment.address])"></p>
            <p v-else-if="modalType === 'verify' && !modalError" class="break-words" v-html="$t('editor.verify.message')"></p>
            <p v-else-if="modalType === 'verify' && modalError" class="break-words" v-html="$t('editor.verify.error')"></p>
        </template>
    </v-modal>

    <v-section :noPadding="true" class="bg-typography_primary">
        <div v-if="!isLoadingEditor" class="flex flex-col md:flex-row">
            <div class="flex flex-col w-full md:w-6/12 lg:w-5/12 xl:w-4/12 p-sm h-fit" ref="editorContainer" :key="lastSaved">
                <v-editor
                    @contractChanged="handleContractChange"
                    @deployContract="handleDeployContract"
                    @verifyContract="handleVerifyContract"
                    :name="storedContract.name"
                    :symbol="storedContract.symbol"
                    :extensions="storedContract.extensions"
                    :metadata="storedContract.metadata"
                    :isVerified="isVerified"
                    :canVerify="canVerify"
                    :canDeploy="canDeploy"
                    :id="route.params.id"
                >
                    <span v-if="!isLoading && contractEdited" class="flex items-center mt-sm text-sm">{{
                        $t('editor.last_saved', [$d(lastSaved, 'short')])
                    }}</span>
                    <span v-else-if="isLoading" class="flex items-center mt-sm text-sm"
                        >{{ $t('editor.saving') }} <RefreshIcon class="h-4 w-4 animate-spin-reverse transform rotate-180"
                    /></span>
                    <span class="flex items-center mt-xs text-sm"
                        >{{ $t('editor.contract.id') }}<strong class="ml-1">{{ route.params.id }}</strong
                        ><DocumentDuplicateIcon
                            @click="copyContractId"
                            class="h-5 w-5 block ml-1 cursor-pointer hover:text-brand_secondary transition duration-300"
                    /></span>
                    <span v-if="isDeployed" class="items-center mt-xs text-sm break-all block"
                        >{{ $t('editor.contract.deploy') }}<strong class="ml-1 break-all">{{ storedContract.deployment.address }}</strong
                        ><DocumentDuplicateIcon
                            @click="copyContractAddress"
                            class="inline h-5 w-5 block ml-1 cursor-pointer hover:text-brand_secondary transition duration-300"
                    /></span>
                    <span v-if="isVerified" class="flex items-center mt-xs text-sm"
                        >{{ $t('editor.contract.verified') }}<BadgeCheckIcon class="h-5 w-5 block ml-1 text-brand_secondary"
                    /></span>
                    <a
                        v-if="isDeployed && storedContract.deployment.network"
                        class="flex items-center mt-xs text-sm hover:text-brand_secondary transition-colors duration-300"
                        :href="`https://${storedContract.deployment.network}.etherscan.io/address/${storedContract.deployment.address}`"
                        aria-label="View on Etherscan"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ $t('editor.contract.view') }} <ExternalLinkIcon class="h-5 w-5 block ml-1"
                    /></a>
                    <router-link
                        v-if="isDeployed"
                        class="flex items-center mt-xs text-sm hover:text-brand_secondary transition-colors duration-300"
                        :to="`/interact/${storedContract.id}`"
                        >{{ $t('editor.contract.interact') }}<PlayIcon class="h-5 w-5 block ml-1"
                    /></router-link>
                </v-editor>
            </div>
            <div class="flex w-full md:w-6/12 lg:w-7/12 xl:w-8/12 p-sm" :style="`min-height: ${editorHeight}px; max-height: ${editorHeight}px`">
                <v-code-viewer
                    @downloadContract="handleDownloadContract"
                    :key="contract"
                    class="flex flex-col w-full"
                    :code="contract"
                    :loading="isLoading"
                    :canDownload="canDownload"
                    :loadingDownload="isLoadingDownload"
                />
            </div>
        </div>
        <div v-else class="flex flex-row items-center justify-center p-xs md:p-md">
            <div class="bg-brand_secondary w-full rounded-lg text-typography_primary">
                <h4 class="flex items-center justify-center my-base py-xl">
                    {{ $t('editor.prepare') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
            </div>
        </div>
    </v-section>

    <v-section class="bg-typography_primary">
        <h2 class="text-center text-brand_secondary mb-base">Fields Explained</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
    </v-section>
</template>

<script setup>
// Components
import vCodeViewer from '@/components/codeViewer.vue';
import vEditor from '@/components/editor.vue';
import vModal from '@/components/modal.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon, RefreshIcon, DocumentDuplicateIcon, BadgeCheckIcon, ExternalLinkIcon, PlayIcon } from '@heroicons/vue/solid';

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
    router = useRouter();

import { useApi } from '@/plugins/api';
const api = useApi();

import { ref, computed } from 'vue';
const isOpen = ref(false);
const modalType = ref(undefined);
const modalError = ref(undefined);
const showModal = () => {
    isOpen.value = !isOpen.value;
};
const handleModalClose = () => {
    isOpen.value = false;
    modalType.value = undefined;
    modalError.value = undefined;
    isLoadingModal.value = false;
};

import { useMeta } from 'vue-meta';
useMeta({
    title: 'Contract Editor',
    description: 'This is the homepage to our project'
});

const contract = ref(t('editor.contract.empty'));
const storedContract = ref({});
const isLoading = ref(false);
const isLoadingEditor = ref(true);
const isLoadingModal = ref(false);
const isLoadingDownload = ref(false);
const lastSaved = ref(undefined);
const contractEdited = ref(false);

const loadContract = () => {
    isLoadingEditor.value = true;
    api.getContract(route.params.id)
        .then((res) => {
            storedContract.value = res.data;
            if (res.data.contract) {
                contractEdited.value = true;
                lastSaved.value = new Date();
                contract.value = res.data.contract;
            }
            isLoadingEditor.value = false;
        })
        .catch((err) => {
            router.replace({
                path: '/404'
            });
        });
};
loadContract();

import { mapFormToApiData } from '@/js/mapper';
const handleContractChange = (contractData) => {
    let dataToSend = mapFormToApiData(contractData);
    if (dataToSend.name && dataToSend.symbol) {
        isLoading.value = true;
        api.editContract(route.params.id, mapFormToApiData(contractData)).then((res) => {
            contract.value = res.data.contract;
            storedContract.value = res.data;
            contractEdited.value = true;
            lastSaved.value = new Date();
            isLoading.value = false;
        });
    }
};

const isDeployed = computed(() => {
    return storedContract.value && storedContract.value.deployment?.address;
});
const handleDeployContract = () => {
    modalType.value = 'deploy';
    isLoadingModal.value = true;
    showModal();
    api.deployContract(route.params.id)
        .then((res) => {
            storedContract.value = res.data;
            isLoadingModal.value = false;
        })
        .catch((err) => {
            console.log(err);
            isLoadingModal.value = false;
        });
};

const isVerified = computed(() => {
    return (
        isDeployed.value &&
        storedContract.value.verification &&
        storedContract.value.verification.verifiedAddress === storedContract.value.deployment.address
    );
});
const canVerify = computed(() => {
    return (
        isDeployed.value &&
        ((storedContract.value.verification && storedContract.value.verification.verifiedAddress !== storedContract.value.deployment.address) ||
            !storedContract.value.verification)
    );
});
const canDeploy = computed(() => {
    return (
        storedContract.value.name !== undefined &&
        storedContract.value.name !== null &&
        storedContract.value.name !== '' &&
        storedContract.value.name !== undefined &&
        storedContract.value.name !== null &&
        storedContract.value.name !== ''
    );
});
const canDownload = computed(() => {
    return (
        storedContract.value.name !== undefined &&
        storedContract.value.name !== null &&
        storedContract.value.name !== '' &&
        storedContract.value.symbol !== undefined &&
        storedContract.value.symbol !== null &&
        storedContract.value.symbol !== ''
    );
});
const handleVerifyContract = () => {
    modalType.value = 'verify';
    isLoadingModal.value = true;
    showModal();
    api.verifyContract(route.params.id)
        .then((res) => {
            storedContract.value = res.data;
            isLoadingModal.value = false;
        })
        .catch((err) => {
            console.log(err);
            modalError.value = true;
            isLoadingModal.value = false;
        });
};
const handleDownloadContract = () => {
    isLoadingDownload.value = true;
    api.downloadContract(route.params.id)
        .then((res) => {
            isLoadingDownload.value = false;
            setSnackbar('Contract is downloaded!', 'default', 5);
        })
        .catch((err) => {
            isLoadingDownload.value = false;
            console.log(err);
        });
};

const copyContractId = () => {
    if (!navigator.clipboard) {
        setSnackbar('Cannot copy contract ID to clipboard!', 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(route.params.id)
        .then(() => {
            setSnackbar('Copied to clipboard!', 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar('Cannot copy contract ID to clipboard!', 'error', 5);
        });
};

const copyContractAddress = () => {
    if (!navigator.clipboard) {
        setSnackbar('Cannot copy contract address to clipboard!', 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(storedContract.value.deployment.address)
        .then(() => {
            setSnackbar('Copied to clipboard!', 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar('Cannot copy contract address to clipboard!', 'error', 5);
        });
};

// Container heights
const editorContainer = ref(null);
const editorHeight = computed(() => {
    return editorContainer.value?.clientHeight;
});
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
