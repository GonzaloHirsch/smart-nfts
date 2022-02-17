<template>
    <v-section
        :noPadding="true"
        :class="[(!validContract || (!contractIsDeployed && hasContract)) && !isLoading ? 'bg-gradient-to-b from-error to-white' : '']"
    >
        <form class="grid grid-cols-10 gap-sm p-sm" autocomplete="off">
            <div class="col-span-full entire-panel">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex">
                        <h2 class="text-left text-brand_secondary">{{hasContract && contractIsDeployed && !isLoading && validContract ? contract.name : 'Tokens'}}</h2>
                        <v-button v-if="hasContract && contractIsDeployed && !isLoading" format="primary" :href="`/create/${contractId}`" target="_self" aria="Edit this contract" :external="false" :white="false" text="EDIT CONTRACT" size="small" class="h-fit my-auto ml-sm"/>
                    </div>
                    <v-input
                        id="contract_id"
                        name="contract_id"
                        label="Contract ID"
                        :hideLabel="true"
                        placeholder="Contract ID..."
                        v-model="contractId"
                        :continuousInput="false"
                        format="primary-white"
                    />
                </div>
            </div>
        </form>
    </v-section>

    <v-section :noPadding="true" v-if="hasContract && contractIsDeployed && !isLoading && validContract">
        <div v-if="tokens && tokens.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-sm p-sm">
            <template v-for="(token, index) in tokens" :key="token.id">
                <v-token-card :owner="token.owner" :hash="token.uriHash" :id="token.id" :contractAddress="contract.deployment.address" :showOpensea="contract.deployment.network === 'rinkeby'" :network="contract.deployment.network" class="col-span-1"/>
            </template>
        </div>
    </v-section>
    
    <v-section :noPadding="true" v-if="isLoading">
        <div class="flex flex-row items-center justify-center p-xs md:p-md">
            <div class="bg-brand_secondary w-full rounded-lg text-typography_primary">
                <h4 class="flex items-center justify-center my-base py-xl">
                    {{ $t('showcase.prepare') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
            </div>
        </div>
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';
import vTokenCard from '@/components/visualize/tokenCard.vue';
import vSection from '@/components/section.vue';
import { NAV_HEIGHT, EXTENSIONS } from '@/js/constants.js';
import { RefreshIcon } from '@heroicons/vue/solid';

// Router
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(),
    router = useRouter();

import { ref, computed, watch, inject } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const isLoading = ref(false);
const validContract = ref(true);
const contractId = ref(undefined);
const contract = ref({});
const hasContract = computed(() => !(contractId.value === '' || contractId.value === null || contractId.value === undefined));
const contractIsDeployed = computed(() => hasContract.value && contract.value.deployment?.address !== null && contract.value.deployment?.address !== undefined && contract.value.deployment?.address !== '');
const tokens = ref([]);

watch(
    () => contractId.value,
    () => {
        router.replace({
            path: contractId.value ? `/tokens/${contractId.value}` : '/tokens'
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
                api.getContract(contractId.value)
                    .then((res) => {
                        contract.value = res.data;
                        validContract.value = true;
                        // Todo: verify the contract is mintable
                        if (!contractIsDeployed.value) {
                            setSnackbar('Contract has not been deployed yet!', 'error', 5);
                        } else {
                            // Load tokens
                            api.getTokens(contractId.value, 1).then(res => {
                                tokens.value = []
                                for (const [id, info] of Object.entries(res.data?.listing)) {
                                    tokens.value.push({
                                        id: id,
                                        ...info
                                    });
                                }
                                isLoading.value = false;
                            }).catch(res => {
                                tokens.value = [];
                                console.error(res)
                                isLoading.value = false;
                            })
                        }
                    })
                    .catch((err) => {
                        validContract.value = false;
                        setSnackbar("Contract doesn't exist!", 'error', 5);
                        isLoading.value = false;
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

// Meta
import { useMeta } from 'vue-meta';
useMeta({
    title: 'Token Showcase',
    description: 'This is the homepage to our project'
});
</script>

<style>
.entire-panel {
    @apply flex flex-col bg-light rounded-md shadow-lg border border-gray-200 pt-sm pb-sm px-base h-fit;
}
</style>