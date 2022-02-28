<template>
    <v-section
        :noPadding="true"
        :class="[(!validContract || (!contractIsDeployed && hasContract)) && !isLoading ? 'bg-gradient-to-b from-error to-white' : '']"
    >
        <div class="grid grid-cols-10 gap-sm p-sm" autocomplete="off">
            <div class="col-span-full entire-panel">
                <div class="flex flex-col sm:flex-row mb-sm sm:mb-0 justify-between items-center">
                    <div class="flex">
                        <h2 class="text-left text-brand_secondary">
                            {{
                                hasContract && contractIsDeployed && !isLoading && getAbiMint(contract?.deployment?.abi).length > 0
                                    ? $t('interact.title.create')
                                    : $t('interact.title.default')
                            }}
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
                        <v-tooltip v-if="hasContract && contractIsDeployed && !isLoading" :text="$t('interact.buttons.edit')">
                            <router-link
                                :to="`/create/${contractId}`"
                                :aria-label="$t('interact.buttons.edit')"
                                class="text-gray-500 hover:text-brand_secondary duration-200 flex items-center justify-center ml-xs"
                            >
                                <PencilAltIcon class="action--icon" />
                            </router-link>
                        </v-tooltip>
                        <v-tooltip
                            v-if="hasContract && contractIsDeployed && !isLoading && getAbiMint(contract?.deployment?.abi).length > 0"
                            :text="$t('interact.buttons.view')"
                        >
                            <router-link
                                :to="`/tokens/${contractId}`"
                                :aria-label="$t('interact.buttons.view')"
                                class="text-gray-500 hover:text-brand_secondary duration-200 flex items-center justify-center ml-xs"
                            >
                                <CollectionIcon class="action--icon" />
                            </router-link>
                        </v-tooltip>
                    </div>
                </div>
                <v-interacter
                    :abi="getAbiMint(contract?.deployment?.abi)"
                    :metadata="hasMetadata ? contract.metadata : undefined"
                    :validContract="validContract"
                    :contractDeployed="contractIsDeployed"
                    :hasContract="hasContract"
                    :isMint="true"
                    :isLoading="isLoading"
                    :network="contract?.deployment?.network"
                />
            </div>
            <template v-if="hasContract && contractIsDeployed && !isLoading && validContract">
                <div class="col-span-full lg:col-span-5 entire-panel">
                    <h3 class="text-left text-brand_secondary">{{ $t('interact.read.title') }}</h3>
                    <v-interacter
                        :abi="getAbiRead(contract?.deployment?.abi)"
                        :metadata="undefined"
                        :validContract="validContract"
                        :contractDeployed="contractIsDeployed"
                        :hasContract="hasContract"
                        :isLoading="isLoading"
                        :network="contract?.deployment?.network"
                    />
                </div>
                <div class="col-span-full lg:col-span-5 entire-panel">
                    <h3 class="text-left text-brand_secondary">{{ $t('interact.write.title') }}</h3>
                    <v-interacter
                        :abi="getAbiWrite(contract?.deployment?.abi)"
                        :metadata="undefined"
                        :validContract="validContract"
                        :contractDeployed="contractIsDeployed"
                        :hasContract="hasContract"
                        :isLoading="isLoading"
                        :network="contract?.deployment?.network"
                    />
                </div>
            </template>
        </div>
    </v-section>

    <v-section v-if="validContract && contractIsDeployed && hasContract && !isLoading" :noPadding="true">
        <div class="mx-xl mt-xl bg-brand_primary rounded-md p-base">
            <h4>{{ $t('interact.importantNote.title') }}</h4>
            <div class="inline" v-html="$t('interact.importantNote.content')"></div>
        </div>
    </v-section>

    <v-section class="bg-typography_primary">
        <h2 class="text-center text-brand_secondary mb-base">{{ $t('interact.content.title') }}</h2>
        <v-anchored-title type="h3" text="balanceOf" anchor="balanceOf" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="getApproved" anchor="getApproved" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="isApprovedForAll" anchor="isApprovedForAll" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="name" anchor="name" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="owner" anchor="owner" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="ownerOf" anchor="ownerOf" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="supportsInterface" anchor="supportsInterface" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="symbol" anchor="symbol" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="tokenURI" anchor="tokenURI" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="approve" anchor="approve" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="renounceOwnership" anchor="renounceOwnership" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="safeMint" anchor="safeMint" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="safeTransferFrom" anchor="safeTransferFrom" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="setApprovalForAll" anchor="setApprovalForAll" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="transferFrom" anchor="transferFrom" class="mt-sm" />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <v-anchored-title type="h3" text="transferOwnership" anchor="transferOwnership" class="mt-sm" />
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
import vAnchoredTitle from '@/components/anchoredTitle.vue';
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vInteracter from '@/components/interacter.vue';
import vSection from '@/components/section.vue';
import { EXTENSIONS } from '@/js/constants.js';
import { PencilAltIcon, CollectionIcon } from '@heroicons/vue/solid';

// Router
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
    router = useRouter();

import { ref, computed, watch, inject } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

const isLoading = ref(false);
const validContract = ref(true);
const contractId = ref(undefined);
const contract = ref({});
const hasContract = computed(() => !(contractId.value === '' || contractId.value === null || contractId.value === undefined));
const contractIsDeployed = computed(
    () =>
        hasContract.value &&
        contract.value.deployment?.address !== null &&
        contract.value.deployment?.address !== undefined &&
        contract.value.deployment?.address !== ''
);
const hasMetadata = computed(() =>
    contract.value && contract.value.deployment && contract.value.deployment.extensions
        ? contract.value.deployment.extensions.includes(EXTENSIONS.URI_STORAGE)
        : undefined
);

watch(
    () => contractId.value,
    () => {
        router.replace({
            path: contractId.value ? `/interact/${contractId.value}` : '/interact'
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
        if (route.path.includes('/interact')) {
            if (!(route.params.id === '' || route.params.id === null || route.params.id === undefined)) {
                contractId.value = route.params.id;
                // Get the contract
                isLoading.value = true;
                recaptcha.challengeInput('GET_CONTRACT', (token) => {
                    api.getContract(contractId.value, token)
                        .then((res) => {
                            contract.value = res.data;
                            validContract.value = true;
                            isLoading.value = false;
                            if (!contractIsDeployed.value) {
                                setSnackbar(t('errors.contract.notDeployed'), 'error', 2.5);
                            }
                        })
                        .catch((err) => {
                            validContract.value = false;
                            setSnackbar(t('errors.contract.notExist'), 'error', 2.5);
                            isLoading.value = false;
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

// Abi method filtering
const getAbiRead = (abi) => {
    if (!validContract.value || isLoading.value || !hasContract.value || !abi) return [];
    return abi.filter((method) => method.type === 'function' && (method.stateMutability === 'view' || method.stateMutability === 'pure'));
};
const getAbiWrite = (abi) => {
    if (!validContract.value || isLoading.value || !hasContract.value || !abi) return [];
    return abi.filter(
        (method) =>
            method.type === 'function' &&
            (method.stateMutability === 'nonpayable' || method.stateMutability === 'payable') &&
            !method.name.toLowerCase().includes('mint')
    );
};
const getAbiMint = (abi) => {
    if (!validContract.value || isLoading.value || !hasContract.value || !abi) return [];
    return abi.filter(
        (method) =>
            method.type === 'function' &&
            (method.stateMutability === 'nonpayable' || method.stateMutability === 'payable') &&
            method.name.toLowerCase().includes('mint')
    );
};

// Meta
import { useMeta } from 'vue-meta';
useMeta({
    title: t('interact.meta.title'),
    description: t('interact.meta.description')
});
</script>

<style>
.entire-panel {
    @apply flex flex-col bg-light rounded-md shadow-lg border border-gray-200 pt-sm pb-sm px-base h-fit;
}

.action--icon {
    @apply w-9 h-9 my-auto;
}
</style>
