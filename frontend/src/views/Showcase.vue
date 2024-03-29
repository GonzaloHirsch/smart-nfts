<template>
    <v-floating-icon v-if="hasContract && contractIsDeployed && !isLoading && validContract" :format="hasIpfsError ? 'error' : 'primary'">
        <template #icon>
            <InformationCircleIcon v-if="!hasIpfsError" class="h-6 w-6" />
            <ExclamationCircleIcon v-else-if="hasIpfsError" class="h-6 w-6" />
        </template>
        <template #content>
            <p v-if="!hasIpfsError">{{ $t('showcase.floatingInfo.info') }}</p>
            <p v-else-if="hasIpfsError">
                {{ $t('showcase.floatingInfo.error') }}
            </p>
        </template>
    </v-floating-icon>

    <v-modal v-if="enlargedToken" maxWidth="md" :showModal="isOpen" @close="handleModalClose" :noPadding="true" :noScrollbar="true" :darkMode="true">
        <v-token-card
            :owner="enlargedToken.owner"
            :hash="enlargedToken.uriHash"
            :id="enlargedToken.tokenId"
            :contractAddress="contract.deployment.address"
            :showOpensea="contract.deployment.network === 'rinkeby'"
            :network="contract.deployment.network"
            :enlarged="true"
        />
    </v-modal>

    <v-section
        :noPadding="true"
        :class="[
            (!validContract || (!contractIsDeployed && hasContract)) && !isLoading ? 'bg-gradient-to-b from-error to-white' : '',
            (!hasContract || !contractIsDeployed || !validContract) && !isLoading ? 'section--full' : ''
        ]"
    >
        <div class="grid grid-cols-10 gap-sm p-sm" autocomplete="off">
            <div class="col-span-full entire-panel">
                <div class="flex flex-col sm:flex-row justify-between items-center">
                    <div class="flex">
                        <h2 class="text-left text-brand_secondary">
                            {{ hasContract && contractIsDeployed && !isLoading && validContract ? contract.name : $t('showcase.title') }}
                        </h2>
                    </div>
                    <div class="flex mt-xs sm:mt-0">
                        <v-input
                            id="contract_id"
                            name="contract_id"
                            :label="$t('inputs.text.contractId')"
                            :hideLabel="true"
                            :placeholder="$t('inputs.placeholder.contractId')"
                            v-model="contractId"
                            :continuousInput="false"
                            format="primary-white"
                        />
                        <v-tooltip v-if="hasContract && contractIsDeployed && !isLoading" :text="$t('showcase.buttons.edit')">
                            <router-link
                                :to="`/create/${contractId}`"
                                :aria-label="$t('showcase.buttons.edit')"
                                class="text-gray-500 hover:text-brand_secondary duration-200 flex items-center justify-center ml-xs"
                            >
                                <PencilAltIcon class="action--icon" />
                            </router-link>
                        </v-tooltip>
                        <v-tooltip v-if="hasContract && contractIsDeployed && !isLoading" :text="$t('showcase.buttons.interact')">
                            <router-link
                                :to="`/interact/${contractId}`"
                                :aria-label="$t('showcase.buttons.interact')"
                                class="text-gray-500 hover:text-brand_secondary duration-200 flex items-center justify-center ml-xs"
                            >
                                <CursorClickIcon class="action--icon" />
                            </router-link>
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </v-section>

    <v-section :noPadding="true" v-if="hasContract && contractIsDeployed && !isLoadingPage && !isLoading && validContract">
        <div v-if="tokens && tokens.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-sm p-sm relative">
            <template v-for="token in tokens" :key="token.tokenId">
                <v-token-card
                    :owner="token.owner"
                    :hash="token.uriHash"
                    :id="token.tokenId"
                    :contractAddress="contract.deployment.address"
                    :showOpensea="contract.deployment.network === 'rinkeby'"
                    :network="contract.deployment.network"
                    @ipfsError="handleIpfsError"
                    @cardClicked="() => handleCardClicked(token)"
                    class="col-span-1"
                />
            </template>
        </div>
        <div v-else-if="!isLoading">
            <div class="flex flex-row items-center justify-center p-xs md:p-md">
                <div class="bg-brand_secondary w-full rounded-lg text-typography_primary">
                    <h4 class="flex items-center justify-center my-base py-xl">
                        {{ $t('showcase.noTokens') }}
                    </h4>
                </div>
            </div>
        </div>
        <div v-if="tokens && tokens.length > 0" class="flex flex-col items-center justify-center my-base">
            <v-pagination :pagination="pagination" />
        </div>
    </v-section>

    <v-section :noPadding="true" v-if="isLoading || isLoadingPage">
        <v-loading-block :text="isLoadingPage ? 'showcase.preparePage' : 'showcase.prepare'"/>
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vTokenCard from '@/components/visualize/tokenCard.vue';
import vLoadingBlock from '@/components/loadingBlock.vue';
import vSection from '@/components/section.vue';
import vFloatingIcon from '@/components/floatingIcon.vue';
import vPagination from '@/components/visualize/pagination.vue';

import { EXTENSIONS, PAGINATION_PARAM } from '@/js/constants.js';
import { InformationCircleIcon, ExclamationCircleIcon, CursorClickIcon, PencilAltIcon } from '@heroicons/vue/solid';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Router
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
    router = useRouter();

import { ref, computed, watch } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

// Modal
import vModal from '@/components/modal.vue';
const isOpen = ref(false);
const enlargedToken = ref(undefined);
const showModal = () => {
    isOpen.value = !isOpen.value;
};
const handleModalClose = () => {
    isOpen.value = false;
    setTimeout(() => {
        enlargedToken.value = undefined;
    }, 500);
};

const isLoading = ref(false);
const isLoadingPage = ref(false);
const validContract = ref(true);
const contractId = ref(undefined);
const contract = ref({});
const hasContract = computed(() => !(contractId.value === '' || contractId.value === null || contractId.value === undefined));
const contractIsDeployed = computed(
    () =>
        hasContract?.value &&
        contract.value?.deployment &&
        contract.value?.deployment?.address !== null &&
        contract.value?.deployment?.address !== undefined &&
        contract.value?.deployment?.address !== ''
);
const tokens = ref([]);
const pagination = ref({});

const hasIpfsError = ref(false);
const handleIpfsError = () => {
    hasIpfsError.value = true;
};

const handleCardClicked = (token) => {
    enlargedToken.value = token;
    isOpen.value = true;
};

// Get current displayed page
const currentPage = computed(() => {
    let _page = route.query[PAGINATION_PARAM];
    if (_page && !isNaN(_page)) {
        return parseInt(_page, 10);
    }
    return 1;
});

watch(
    () => contractId.value,
    () => {
        router.replace({
            path: contractId.value ? `/tokens/${contractId.value}` : '/tokens',
            query: { ...route.query }
        });
    }
);
watch(
    () => route.params.id,
    () => {
        // We need this line because the watcher is immediate, this makes it run before most of the other stuff
        // That way we load from the url properly
        // If we don't have this if, when you navigate out of this page with a link, it will keep you on the page
        // tl;dr; we need this for the page navigation to work
        if (route.path.includes('/tokens')) {
            if (!(route.params.id === '' || route.params.id === null || route.params.id === undefined)) {
                contractId.value = route.params.id;
                // Get the contract
                isLoading.value = true;
                recaptcha.challengeInput('GET_CONTRACT', (token) => {
                    api.getContract(contractId.value, token)
                        .then((res) => {
                            contract.value = res.data;
                            // Todo: verify the contract is mintable
                            if (!contractIsDeployed.value) {
                                setSnackbar(t('errors.contract.notDeployed'), 'error', 2.5);
                                validContract.value = false;
                                isLoading.value = false;
                            } else if (!contract.value.deployment.extensions.includes(EXTENSIONS.MINTABLE)) {
                                setSnackbar(t('errors.contract.notMint'), 'error', 2.5);
                                validContract.value = false;
                                isLoading.value = false;
                            } else {
                                validContract.value = true;
                                // Load tokens
                                hasIpfsError.value = false;
                                recaptcha.challengeInput('GET_CONTRACT_TOKENS', (_token) => {
                                    api.getTokens(contractId.value, currentPage.value, _token)
                                        .then((res) => {
                                            tokens.value = res.data.records;
                                            pagination.value = res.data._metadata;
                                            isLoading.value = false;
                                        })
                                        .catch((res) => {
                                            tokens.value = [];
                                            console.error(res);
                                            isLoading.value = false;
                                        });
                                });
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            validContract.value = false;
                            isLoading.value = false;
                            if (err?.response?.status === 404) {
                                setSnackbar(t('errors.contract.notExist'), 'error', 2.5);
                            } else if (err?.response?.status === 403) {
                                setSnackbar(t('errors.robot'), 'error', 2.5);
                            } else {
                                setSnackbar(t('errors.internal'), 'error', 2.5);
                            }
                        });
                });
            } else {
                contractId.value = undefined;
                contract.value = {};
                validContract.value = true;
            }
        }
    },
    { immediate: true }
);
// Cannot be immediate, otherwise there's a race condition there
watch(
    () => route.query?.[PAGINATION_PARAM],
    () => {
        if (route.path.includes('/tokens')) {
            if (!(route.params.id === '' || route.params.id === null || route.params.id === undefined)) {
                // Load tokens
                hasIpfsError.value = false;
                isLoadingPage.value = true;
                recaptcha.challengeInput('GET_CONTRACT_TOKENS', (token) => {
                    api.getTokens(contractId.value, currentPage.value, token)
                        .then((res) => {
                            tokens.value = res.data.records;
                            pagination.value = res.data._metadata;
                            isLoading.value = false;
                            isLoadingPage.value = false;
                        })
                        .catch((res) => {
                            tokens.value = [];
                            console.error(res);
                            isLoading.value = false;
                            isLoadingPage.value = false;
                            if (err?.response?.status === 403) {
                                setSnackbar(t('errors.robot'), 'error', 2.5);
                            } else {
                                setSnackbar(t('errors.internal'), 'error', 2.5);
                            }
                        });
                });
            } else {
                contractId.value = undefined;
                contract.value = {};
                validContract.value = true;
            }
        }
    }
);

import { useMeta } from 'vue-meta';
useMeta({
    title: t('showcase.meta.title'),
    description: t('showcase.meta.description')
});
</script>

<style>
.entire-panel {
    @apply flex flex-col bg-light rounded-md shadow-lg border border-gray-200 pt-sm pb-sm px-sm h-fit;
}

.action--icon {
    @apply w-9 h-9 my-auto;
}

@screen md {
    .entire-panel {
        @apply pt-sm pb-sm px-base;
    }
}
</style>
