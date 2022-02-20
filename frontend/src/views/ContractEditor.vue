<template>
    <v-deploy-contract-modal
        v-if="modalType === 'deploy'"
        :isLoadingModal="isLoadingModal"
        :modalError="modalError"
        :deployedAddress="storedContract?.deployment?.address"
        :showModal="isOpen"
        @close="handleModalClose"
    />
    <v-verify-contract-modal
        v-if="modalType === 'verify'"
        :isLoadingModal="isLoadingModal"
        :modalError="modalError"
        :showModal="isOpen"
        @close="handleModalClose"
    />
    <v-remind-contract-modal v-if="modalType === 'email'" :contractId="route.params.id" :showModal="isOpen" @close="handleEmailModalClose" />

    <v-section :noPadding="true" class="bg-typography_primary">
        <div v-if="!isLoadingEditor" class="flex flex-col md:flex-row">
            <div
                class="flex flex-col w-full md:w-6/12 lg:w-5/12 xl:w-4/12 py-sm pr-xs pl-sm h-fit"
                id="editorContainer"
                ref="editorContainer"
                :key="lastSaved"
            >
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
                    <template #expandableHead>
                        <v-tooltip v-if="contractEdited" :text="!isLoading ? $t('editor.lastSaved', [$d(lastSaved, 'short')]) : $t('editor.saving')">
                            <span class="expandable-head--icon-wrapper">
                                <CloudUploadIcon v-if="!isLoading" class="expandable-head--icon" />
                                <RefreshIcon v-else class="expandable-head--icon animate-spin-reverse" />
                            </span>
                        </v-tooltip>
                        <v-tooltip :text="$t('editor.contract.idCopy')">
                            <span @click="copyContractId" class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary">
                                <DocumentIcon class="expandable-head--icon" />
                            </span>
                        </v-tooltip>
                        <v-tooltip v-if="isDeployed" :text="$t('editor.contract.deployCopy')">
                            <span @click="copyContractAddress" class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary"
                                ><GlobeAltIcon class="expandable-head--icon"
                            /></span>
                        </v-tooltip>
                        <v-tooltip v-if="isVerified" :text="$t('editor.contract.verified')">
                            <span class="expandable-head--icon-wrapper"><BadgeCheckIcon class="expandable-head--icon" /></span>
                        </v-tooltip>
                        <v-tooltip v-if="isDeployed" :text="$t('editor.contract.interact')">
                            <router-link
                                class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary"
                                :to="`/interact/${storedContract.id}`"
                                ><PlayIcon class="expandable-head--icon"
                            /></router-link>
                        </v-tooltip>
                    </template>
                    <template #expandableContent>
                        <div class="my-xs" v-if="contractEdited">
                            <v-information-item
                                :title="isLoading ? $t('editor.saving') : $t('editor.lastSavedSimple')"
                                :description="isLoading ? undefined : $t('date', [$d(lastSaved, 'short')])"
                            >
                                <template #icon>
                                    <CloudUploadIcon v-if="!isLoading" class="expandable-content--icon" />
                                    <RefreshIcon v-else class="expandable-content--icon animate-spin-reverse" />
                                </template>
                            </v-information-item>
                        </div>
                        <div class="my-xs">
                            <v-information-item :showActions="true" :title="$t('editor.contract.idSimple')" :description="route.params.id">
                                <template #icon>
                                    <DocumentIcon class="expandable-content--icon" />
                                </template>
                                <template #actions>
                                    <v-tooltip :text="$t('editor.contract.idCopy')">
                                        <DocumentDuplicateIcon @click="copyContractId" class="expandable-content--icon-action" />
                                    </v-tooltip>
                                    <v-tooltip v-if="canSendEmail" :text="$t('editor.contract.reminder')" class="ml-xs">
                                        <MailIcon @click="openContractReminderModal" class="expandable-content--icon-action" />
                                    </v-tooltip>
                                </template>
                            </v-information-item>
                        </div>
                        <div class="my-xs" v-if="isDeployed">
                            <v-information-item
                                :showActions="true"
                                :title="$t('editor.contract.deploySimple')"
                                :description="storedContract.deployment.address"
                            >
                                <template #icon>
                                    <GlobeAltIcon class="expandable-content--icon" />
                                </template>
                                <template #actions>
                                    <v-tooltip :text="$t('editor.contract.deployCopy')">
                                        <DocumentDuplicateIcon @click="copyContractAddress" class="expandable-content--icon-action" />
                                    </v-tooltip>
                                    <v-tooltip :text="$t('editor.contract.view')" class=" ml-xs">
                                        <a
                                            class="expandable-content--icon-action"
                                            :href="`https://${storedContract.deployment.network}.etherscan.io/address/${storedContract.deployment.address}`"
                                            aria-label="View on Etherscan"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            ><v-etherscan-logo class="expandable-content--icon-action"
                                        /></a>
                                    </v-tooltip>
                                </template>
                            </v-information-item>
                        </div>
                    </template>
                </v-editor>
            </div>
            <div
                class="flex w-full md:w-6/12 lg:w-7/12 xl:w-8/12 py-sm pr-sm pl-xs"
                :style="`min-height: ${editorHeight}px; max-height: ${editorHeight}px`"
            >
                <v-code-viewer
                    @downloadContract="handleDownloadContract"
                    :key="contract.digest"
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

import vDeployContractModal from '@/components/modals/deployContractModal.vue';
import vVerifyContractModal from '@/components/modals/verifyContractModal.vue';
import vRemindContractModal from '@/components/modals/remindContractModal.vue';
import vInformationItem from '@/components/editor/informationItem.vue';

import {
    QuestionMarkCircleIcon,
    RefreshIcon,
    DocumentDuplicateIcon,
    DocumentIcon,
    BadgeCheckIcon,
    ExternalLinkIcon,
    PlayIcon,
    MailIcon,
    CloudUploadIcon,
    GlobeAltIcon
} from '@heroicons/vue/solid';
import vEtherscanLogo from '@/assets/images/icons/etherscan.svg?component';

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
    router = useRouter();

import { useApi } from '@/plugins/api';
const api = useApi();

import { ref, computed, onMounted, nextTick } from 'vue';
const isOpen = ref(false);
const modalType = ref(undefined);
const modalError = ref(undefined);
const showModal = () => {
    isOpen.value = !isOpen.value;
};
const handleModalClose = () => {
    isOpen.value = false;
    setTimeout(() => {
        modalType.value = undefined;
        modalError.value = undefined;
        isLoadingModal.value = false;
    }, 500);
};
const handleEmailModalClose = () => {
    loadContract(false);
    isOpen.value = false;
    setTimeout(() => {
        modalType.value = undefined;
        modalError.value = undefined;
        isLoadingModal.value = false;
    }, 500);
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

const loadContract = (showLoading = true) => {
    if (showLoading) isLoadingEditor.value = true;
    api.getContract(route.params.id)
        .then((res) => {
            storedContract.value = res.data;
            if (res.data.contract) {
                contractEdited.value = true;
                lastSaved.value = new Date();
                contract.value = res.data.contract;
            }
            if (showLoading) isLoadingEditor.value = false;
            // Wait until next tick so that the editor is rendered
            nextTick().then(() => {
                startWatchingHeight();
            });
        })
        .catch((err) => {
            if (err.response.status >= 500) {
                router.replace({
                    path: '/500'
                });
            } else {
                router.replace({
                    path: '/404'
                });
            }
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
            // Wait until next tick so that the editor is rendered
            nextTick().then(() => {
                startWatchingHeight();
            });
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
            isLoadingModal.value = false;
            modalError.value = err.response.data;
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
        storedContract.value.name !== '' &&
        storedContract.value.digest !== storedContract.value?.deployment?.digest
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
const canSendEmail = computed(() => {
    if (!storedContract.value?.reminder) return true;
    let diff = (new Date().getTime() - new Date(storedContract.value?.reminder?.date).getTime()) / (1000 * 60 * 60);
    return diff >= 8;
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

const openContractReminderModal = () => {
    modalType.value = 'email';
    showModal();
};

// Container heights
const editorHeight = ref(undefined);
const editorContainer = ref(null);
const startWatchingHeight = () => {
    const resizeObserver = new ResizeObserver(() => {
        editorHeight.value = editorContainer.value?.clientHeight;
    });
    resizeObserver.observe(editorContainer.value);
};
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

.expandable-head--icon {
    @apply w-6 h-6;
}

@screen md {
    .expandable-head--icon {
        @apply w-8 h-8;
    }
}

.expandable-content--icon {
    @apply w-6 h-6;
}

@screen md {
    .expandable-content--icon {
        @apply w-8 h-8;
    }
}

.expandable-content--icon-action {
    @apply h-6 w-6 cursor-pointer duration-300;
}

.expandable-content--icon-action-small {
    @apply h-4 w-4 cursor-pointer duration-300;
}

.expandable-content--icon-action:hover {
    @apply text-brand_secondary;
}

.expandable-head--icon-wrapper {
    @apply flex items-center text-sm p-1 transition-colors duration-300;
}

.expandable-head--icon-wrapper:not(:first-of-type):not(:last-of-type) {
    @apply mx-1;
}

.expandable-head--icon-wrapper:first-of-type {
    @apply mr-1;
}

.expandable-head--icon-wrapper:last-of-type {
    @apply ml-1;
}
</style>
