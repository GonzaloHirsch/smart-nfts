<template>
    <v-deploy-contract-modal
        v-if="modalType === 'deploy'"
        :isLoadingCompile="isLoadingCompile"
        :isLoadingDeploy="isLoadingDeploy"
        :step="deployStep"
        :modalError="modalError"
        :deployedAddress="storedContract?.deployment?.address"
        :showModal="isOpen"
        @close="handleModalClose"
    />
    <v-verify-contract-modal
        v-if="modalType === 'verify'"
        :isLoadingModal="isLoadingVerification"
        :modalError="modalError"
        :showModal="isOpen"
        @close="handleModalClose"
    />
    <v-remind-contract-modal v-if="modalType === 'email'" :contractId="route.params.id" :showModal="isOpen" @close="handleEmailModalClose" />

    <v-floating-icon v-if="!isLoadingEditor" format="primary">
        <template #icon>
            <vIdIcon class="h-6 w-6" />
        </template>
        <template #content>
            <p>{{ $t('editor.contract.idMoreInfo') }}</p>
        </template>
    </v-floating-icon>

    <v-section :noPadding="true" class="bg-typography_primary">
        <div v-if="!isLoadingEditor" class="flex flex-col md:flex-row">
            <div
                class="flex flex-col w-full md:w-6/12 lg:w-5/12 xl:w-4/12 px-xs pb-xs md:py-sm md:pr-xs md:pl-sm h-fit"
                id="editorContainer"
                ref="editorContainer"
                :key="lastSaved"
            >
                <v-editor
                    @contractChanged="handleContractChange"
                    @metadataChanged="handleMetadataChange"
                    @deployContract="handleDeployContract"
                    @verifyContract="handleVerifyContract"
                    :name="storedContract.name"
                    :symbol="storedContract.symbol"
                    :extensions="storedContract.extensions"
                    :extensionInputs="storedContract?.inputs || {}"
                    :metadata="storedContract.metadata"
                    :isVerified="isVerified"
                    :isLoading="isLoading || isLoadingMetadata"
                    :canVerify="canVerify"
                    :canDeploy="canDeploy"
                    :id="route.params.id"
                >
                    <template #expandableHead>
                        <div class="flex w-full justify-center items-center mb-1">
                            <span class="text-sm">{{$t('editor.contract.moreInfo')}}</span>
                        </div>
                        <div class="flex flex-row justify-center items-center">
                            <v-tooltip
                                v-if="contractEdited"
                                :text="!isLoading && !isLoadingMetadata ? $t('editor.lastSaved', [$d(lastSaved, 'short')]) : $t('editor.saving')"
                            >
                                <span class="expandable-head--icon-wrapper">
                                    <CloudUploadIcon v-if="!isLoading && !isLoadingMetadata" class="expandable-head--icon" />
                                    <RefreshIcon v-else class="expandable-head--icon animate-spin-reverse" />
                                </span>
                            </v-tooltip>
                            <v-tooltip :text="$t('editor.contract.idCopy')">
                                <span
                                    @click="copyContractId"
                                    :aria-label="$t('editor.contract.idCopy')"
                                    class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary"
                                >
                                    <vIdIcon class="expandable-head--icon" />
                                </span>
                            </v-tooltip>
                            <v-tooltip v-if="isDeployed" :text="$t('editor.contract.deployCopy')">
                                <span
                                    @click="copyContractAddress"
                                    :aria-label="$t('editor.contract.deployCopy')"
                                    class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary"
                                    ><GlobeAltIcon class="expandable-head--icon"
                                /></span>
                            </v-tooltip>
                            <v-tooltip v-if="isVerified" :text="$t('editor.contract.verified')">
                                <span class="expandable-head--icon-wrapper"><BadgeCheckIcon class="expandable-head--icon" /></span>
                            </v-tooltip>
                            <v-tooltip v-if="isDeployed" :text="$t('editor.contract.interact')">
                                <router-link
                                    :aria-label="$t('editor.contract.interact')"
                                    class="expandable-head--icon-wrapper hover:cursor-pointer hover:text-brand_secondary"
                                    :to="`/interact/${storedContract.id}`"
                                    ><PlayIcon class="expandable-head--icon"
                                /></router-link>
                            </v-tooltip>
                        </div>
                    </template>
                    <template #expandableContent>
                        <div class="my-xs" v-if="contractEdited">
                            <v-information-item
                                :title="isLoading || isLoadingMetadata ? $t('editor.saving') : $t('editor.lastSavedSimple')"
                                :description="isLoading || isLoadingMetadata ? undefined : $t('date', [$d(lastSaved, 'short')])"
                            >
                                <template #icon>
                                    <CloudUploadIcon v-if="!isLoading && !isLoadingMetadata" class="expandable-content--icon" />
                                    <RefreshIcon v-else class="expandable-content--icon animate-spin-reverse" />
                                </template>
                            </v-information-item>
                        </div>
                        <div class="my-xs">
                            <v-information-item :showActions="true" :title="$t('editor.contract.idSimple')" :description="route.params.id">
                                <template #icon>
                                    <vIdIcon class="expandable-content--icon" />
                                </template>
                                <template #actions>
                                    <v-tooltip :text="$t('editor.contract.idCopy')" :class="[canSendEmail ? 'mr-xs' : '']">
                                        <DocumentDuplicateIcon
                                            @click="copyContractId"
                                            :aria-label="$t('editor.contract.idCopy')"
                                            class="expandable-content--icon-action"
                                        />
                                    </v-tooltip>
                                    <v-tooltip v-if="canSendEmail" :text="$t('editor.contract.reminder')">
                                        <MailIcon
                                            @click="openContractReminderModal"
                                            :aria-label="$t('editor.contract.reminder')"
                                            class="expandable-content--icon-action"
                                        />
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
                                    <v-tooltip :text="$t('editor.contract.deployCopy')" class="mr-xs">
                                        <DocumentDuplicateIcon
                                            @click="copyContractAddress"
                                            :aria-label="$t('editor.contract.deployCopy')"
                                            class="expandable-content--icon-action"
                                        />
                                    </v-tooltip>
                                    <v-tooltip :text="$t('editor.contract.view')">
                                        <a
                                            class="expandable-content--icon-action"
                                            :href="`https://${storedContract.deployment.network}.etherscan.io/address/${storedContract.deployment.address}`"
                                            :aria-label="$t('editor.contract.view')"
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
                class="flex w-full md:w-6/12 lg:w-7/12 xl:w-8/12 px-xs pt-sm md:py-sm md:pr-sm md:pl-xs code-viewer--wrapper"
                :style="`min-height: ${editorHeight}px; max-height: ${editorHeight}px`"
                id="codeContainer"
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

    <v-section class="bg-typography_primary editor--content">
        <h2 class="text-center text-brand_secondary mb-base">{{ $t('editor.content.title') }}</h2>
        <v-anchored-title type="h3" :text="$t('editor.content.contractInformation.title')" anchor="contractInformation" class="mb-xs" />
        <p v-html="$t('editor.content.contractInformation.copy')"></p>
        <v-anchored-title type="h3" :text="$t('editor.content.creation.title')" anchor="creation" class="mb-xs" />
        <p v-html="$t('editor.content.creation.copy_1')"></p>
        <p v-html="$t('editor.content.creation.copy_2')"></p>
        <v-anchored-title type="h4" :text="$t('editor.content.creation.mintable.title')" anchor="mintable" class="mb-xs" />
        <p v-html="$t('editor.content.creation.mintable.copy_1')"></p>
        <v-anchored-title type="h5" :text="$t('editor.content.creation.mintable.autoincrementIds.title')" anchor="autoincrementIds" class="mb-xs" />
        <p v-html="$t('editor.content.creation.mintable.autoincrementIds.copy_1')"></p>
        <v-anchored-title type="h4" :text="$t('editor.content.creation.pausable.title')" anchor="pausable" class="mb-xs" />
        <p v-html="$t('editor.content.creation.pausable.copy_1')"></p>
        <v-anchored-title type="h4" :text="$t('editor.content.creation.burnable.title')" anchor="burnable" class="mb-xs" />
        <p v-html="$t('editor.content.creation.burnable.copy_1')"></p>
        <v-anchored-title type="h4" :text="$t('editor.content.creation.enumerable.title')" anchor="enumerable" class="mb-xs" />
        <p v-html="$t('editor.content.creation.enumerable.copy_1')"></p>
        <ul>
            <li v-html="$t('editor.content.creation.enumerable.copy_2.bullet_1')"></li>
            <li v-html="$t('editor.content.creation.enumerable.copy_2.bullet_2')"></li>
            <li v-html="$t('editor.content.creation.enumerable.copy_2.bullet_3')"></li>
        </ul>
        <v-anchored-title type="h5" :text="$t('editor.content.creation.enumerable.limitedSupply.title')" anchor="limitedSupply" class="mb-xs" />
        <p v-html="$t('editor.content.creation.enumerable.limitedSupply.copy_1')"></p>
        <v-anchored-title type="h4" :text="$t('editor.content.creation.uriStorage.title')" anchor="uriStorage" class="mb-xs" />
        <p v-html="$t('editor.content.creation.uriStorage.copy_1')"></p>
        <v-anchored-title type="h5" :text="$t('editor.content.creation.uriStorage.uniqueStorage.title')" anchor="uniqueStorage" class="mb-xs" />
        <p v-html="$t('editor.content.creation.uriStorage.uniqueStorage.copy_1')"></p>
        <v-anchored-title type="h3" :text="$t('editor.content.metadata.title')" anchor="metadata" class="mb-xs" />
        <p v-html="$t('editor.content.metadata.copy_1')"></p>
        <p v-html="$t('editor.content.metadata.copy_2')"></p>
        <p v-html="$t('editor.content.metadata.copy_3')"></p>
        <p v-html="$t('editor.content.metadata.copy_4')"></p>
        <v-anchored-title type="h3" :text="$t('editor.content.deploy.title')" anchor="deploy" class="mb-xs" />
        <p v-html="$t('editor.content.deploy.copy_1')"></p>
        <p v-html="$t('editor.content.deploy.copy_2')"></p>
        <p v-html="$t('editor.content.deploy.copy_3')"></p>
        <v-anchored-title type="h3" :text="$t('editor.content.verify.title')" anchor="verify" class="mb-xs" />
        <p v-html="$t('editor.content.verify.copy')"></p>
    </v-section>
</template>

<script setup>
// Components
import vCodeViewer from '@/components/codeViewer.vue';
import vEditor from '@/components/editor.vue';
import vModal from '@/components/modal.vue';
import vSection from '@/components/section.vue';
import vAnchoredTitle from '@/components/anchoredTitle.vue';
import vFloatingIcon from '@/components/floatingIcon.vue';

import vDeployContractModal from '@/components/modals/deployContractModal.vue';
import vVerifyContractModal from '@/components/modals/verifyContractModal.vue';
import vRemindContractModal from '@/components/modals/remindContractModal.vue';
import vInformationItem from '@/components/editor/informationItem.vue';

import {
    QuestionMarkCircleIcon,
    RefreshIcon,
    DocumentDuplicateIcon,
    BadgeCheckIcon,
    ExternalLinkIcon,
    PlayIcon,
    MailIcon,
    CloudUploadIcon,
    GlobeAltIcon
} from '@heroicons/vue/solid';
import vIdIcon from '@/assets/images/icons/IdIcon.svg?component';
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

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

import { useResizeObserver } from '@vueuse/core';

import { ref, computed, onMounted, nextTick, onUpdated } from 'vue';
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
        isLoadingVerification.value = false;
        isLoadingCompile.value = false;
        isLoadingDeploy.value = false;
    }, 500);
};
const handleEmailModalClose = () => {
    loadContract(false);
    isOpen.value = false;
    setTimeout(() => {
        modalType.value = undefined;
        modalError.value = undefined;
        isLoadingVerification.value = false;
        isLoadingCompile.value = false;
        isLoadingDeploy.value = false;
    }, 500);
};

const contract = ref(t('editor.contract.empty'));
const storedContract = ref({});
const isLoading = ref(false);
const isLoadingMetadata = ref(false);
const isLoadingEditor = ref(true);
const isLoadingVerification = ref(false);
const isLoadingCompile = ref(false);
const isLoadingDeploy = ref(false);
const isLoadingDownload = ref(false);
const deployStep = ref(undefined);
const lastSaved = ref(undefined);
const contractEdited = ref(false);

const loadContract = (showLoading = true) => {
    if (showLoading) isLoadingEditor.value = true;
    recaptcha.challengeInput('GET_CONTRACT', (token) => {
        api.getContract(route.params.id, token)
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
    });
};

import { mapFormToApiData } from '@/js/mapper';
const handleContractChange = (contractData, metadataData) => {
    let dataToSend = mapFormToApiData(contractData, metadataData);
    if (dataToSend.name && dataToSend.symbol) {
        isLoading.value = true;
        recaptcha.challengeInput('EDIT_CONTRACT', (token) => {
            api.editContractData(route.params.id, dataToSend, token)
                .then((res) => {
                    contract.value = res.data.contract;
                    storedContract.value = res.data;
                    contractEdited.value = true;
                    lastSaved.value = new Date();
                    isLoading.value = false;
                    // Wait until next tick so that the editor is rendered
                    nextTick().then(() => {
                        startWatchingHeight();
                    });
                })
                .catch((err) => {
                    console.error(err);
                    isLoading.value = false;
                    if (err.response.status === 403) setSnackbar(t('errors.robot'), 'error', 5);
                });
        });
    }
};
const handleMetadataChange = (contractData, metadataData) => {
    let dataToSend = mapFormToApiData(contractData, metadataData);
    if (dataToSend.name && dataToSend.symbol) {
        isLoadingMetadata.value = true;
        recaptcha.challengeInput('EDIT_CONTRACT', (token) => {
            api.editContractMetadata(route.params.id, dataToSend, token)
                .then((res) => {
                    storedContract.value = res.data;
                    contractEdited.value = true;
                    lastSaved.value = new Date();
                    isLoadingMetadata.value = false;
                    // Wait until next tick so that the editor is rendered
                    nextTick().then(() => {
                        startWatchingHeight();
                    });
                })
                .catch((err) => {
                    console.error(err);
                    isLoadingMetadata.value = false;
                    if (err.response.status === 403) setSnackbar(t('errors.robot'), 'error', 5);
                });
        });
    }
};

const isDeployed = computed(() => {
    return storedContract.value && storedContract.value.deployment?.address;
});
const handleDeployContract = () => {
    modalType.value = 'deploy';
    isLoadingCompile.value = true;
    isLoadingDeploy.value = false;
    deployStep.value = 'compile';
    showModal();
    recaptcha.challengeInput('COMPILE_CONTRACT', (_token) => {
        api.compileContract(route.params.id, _token)
            .then(() => {
                deployStep.value = 'deploy';
                isLoadingCompile.value = false;
                isLoadingDeploy.value = true;
                recaptcha.challengeInput('DEPLOY_CONTRACT', (token) => {
                    api.deployContract(route.params.id, token)
                        .then((res) => {
                            storedContract.value = res.data;
                            isLoadingVerification.value = false;
                            isLoadingCompile.value = false;
                            isLoadingDeploy.value = false;
                            deployStep.value = undefined;
                        })
                        .catch((err) => {
                            isLoadingVerification.value = false;
                            isLoadingCompile.value = false;
                            isLoadingDeploy.value = false;
                            deployStep.value = undefined;
                            if (err.response.status === 403) {
                                setSnackbar(t('errors.robot'), 'error', 5);
                            } else if (err.response.status === 504) {
                                setSnackbar(t('errors.timeout'), 'error', 5);
                            } else {
                                modalError.value = err.response.data.internalStatus;
                            }
                        });
                });
            })
            .catch((err) => {
                isLoadingVerification.value = false;
                isLoadingCompile.value = false;
                isLoadingDeploy.value = false;
                deployStep.value = undefined;
                if (err.response.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 5);
                } else if (err.response.status === 504) {
                    setSnackbar(t('errors.timeout'), 'error', 5);
                } else {
                    modalError.value = err.response.data.internalStatus;
                }
            });
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
    isLoadingVerification.value = true;
    showModal();
    recaptcha.challengeInput('VERIFY_CONTRACT', (token) => {
        api.verifyContract(route.params.id, token)
            .then((res) => {
                storedContract.value = res.data;
                isLoadingVerification.value = false;
            })
            .catch((err) => {
                console.log(err);
                modalError.value = true;
                isLoadingVerification.value = false;
                if (err.response.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 5);
                }
            });
    });
};
const handleDownloadContract = () => {
    isLoadingDownload.value = true;
    recaptcha.challengeInput('DOWNLOAD_CONTRACT', (token) => {
        api.downloadContract(route.params.id, token)
            .then((res) => {
                isLoadingDownload.value = false;
                setSnackbar(t('editor.download.message'), 'default', 5);
            })
            .catch((err) => {
                console.log(err);
                isLoadingDownload.value = false;
                if (err.response.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 5);
                } else {
                    setSnackbar(t('editor.download.error'), 'error', 5);
                }
            });
    });
};

const copyContractId = () => {
    if (!navigator.clipboard) {
        setSnackbar(t('errors.contract.notCopyId'), 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(route.params.id)
        .then(() => {
            setSnackbar(t('success.copy'), 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar(t('errors.contract.notCopyId'), 'error', 5);
        });
};

const copyContractAddress = () => {
    if (!navigator.clipboard) {
        setSnackbar(t('errors.contract.notCopyAddress'), 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(storedContract.value.deployment.address)
        .then(() => {
            setSnackbar(t('success.copy'), 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar(t('errors.contract.notCopyAddress'), 'error', 5);
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
    // This doesn't work in Safari :(
    if (editorContainer.value) {
        useResizeObserver(editorContainer, (entries) => {
            editorHeight.value = entries[0].contentRect.height + entries[0].contentRect.top + entries[0].contentRect.x;
        });
    }
};

onMounted(() => {
    loadContract();
});

import { useMeta } from 'vue-meta';
useMeta({
    title: t('editor.meta.title'),
    description: t('editor.meta.description')
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

.editor--content .link {
    @apply underline font-bold duration-200;
}

.editor--content p {
    @apply mb-sm;
}

.editor--content ul {
    @apply list-disc pl-sm mb-sm;
}

.editor--content .link:hover {
    @apply text-brand_secondary;
}

.code-viewer--wrapper {
    min-height: fit-content !important;
}

@screen sm {
    .code-viewer--wrapper {
        min-height: inherit;
    }
}

@media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) and (stroke-color: transparent) {
        #codeContainer {
            max-height: 100vh !important;
            min-height: 100vh !important;
        }
    }
}
</style>
