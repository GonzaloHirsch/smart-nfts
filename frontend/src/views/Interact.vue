<template>
    <v-section
        :noPadding="true"
        :class="[(!validContract || (!contractIsDeployed && hasContract)) && !isLoading ? 'bg-gradient-to-b from-error to-white' : '']"
    >
        <form class="grid grid-cols-10 gap-sm p-sm" autocomplete="off">
            <div class="col-span-full entire-panel">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex">
                        <h2 class="text-left text-brand_secondary">{{hasContract && contractIsDeployed && !isLoading && getAbiMint(contract.abi).length > 0 ? 'Create Token' : 'Contract'}}</h2>
                        <v-button v-if="hasContract && contractIsDeployed && !isLoading" format="primary" :href="`/create/${contractId}`" target="_self" aria="Edit this contract" :external="false" :white="false" text="EDIT CONTRACT" size="small" sizeMobile="xsmall" class="h-fit my-auto ml-sm"/>
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
                <v-interacter
                    :abi="getAbiMint(contract.abi)"
                    :metadata="hasMetadata ? contract.metadata : undefined"
                    :validContract="validContract"
                    :contractDeployed="contractIsDeployed"
                    :hasContract="hasContract"
                    :isMint="true"
                    :isLoading="isLoading"
                />
            </div>
            <template v-if="hasContract && contractIsDeployed && !isLoading && validContract">
                <div class="col-span-full lg:col-span-5 entire-panel">
                    <h3 class="text-left text-brand_secondary">Read</h3>
                    <v-interacter
                        :abi="getAbiRead(contract.abi)"
                        :metadata="undefined"
                        :validContract="validContract"
                        :contractDeployed="contractIsDeployed"
                        :hasContract="hasContract"
                        :isLoading="isLoading"
                    />
                </div>
                <div class="col-span-full lg:col-span-5 entire-panel">
                    <h3 class="text-left text-brand_secondary">Write</h3>
                    <v-interacter
                        :abi="getAbiWrite(contract.abi)"
                        :metadata="undefined"
                        :validContract="validContract"
                        :contractDeployed="contractIsDeployed"
                        :hasContract="hasContract"
                        :isLoading="isLoading"
                    />
                </div>
            </template>
        </form>
    </v-section>

    <v-section v-if="validContract && contractIsDeployed && hasContract && !isLoading" :noPadding="true">
        <div class="mx-xl mt-xl bg-brand_primary rounded-md p-base">
        <h4>Important Note</h4>
        <p class="inline">If you execute the <pre class="code"><code>transferOwnership</code></pre> or <pre class="code"><code>renounceOwnership</code></pre> methods, you will be effectively removing us (the Smart NFTs team) as the owners of your contract, which means that multiple methods will stop working. Be mindful of this action, otherwise you will have to transfer ownership back to us or deploy a new version of this contract.</p>
        </div>
    </v-section>

    <v-section class="bg-typography_primary">
        <h2 class="text-center text-brand_secondary mb-base">Methods Explained</h2>
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
import { NAV_HEIGHT, EXTENSIONS } from '@/js/constants.js';

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
const hasMetadata = computed(() =>
    contract.value && contract.value.extensions ? contract.value.extensions.includes(EXTENSIONS.URI_STORAGE) : undefined
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
                api.getContract(contractId.value)
                    .then((res) => {
                        contract.value = res.data;
                        validContract.value = true;
                        isLoading.value = false;
                        if (!contractIsDeployed.value) {
                            setSnackbar('Contract has not been deployed yet!', 'error', 5);
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
    title: 'Contract Interaction',
    description: 'This is the homepage to our project'
});
</script>

<style>
.entire-panel {
    @apply flex flex-col bg-light rounded-md shadow-lg border border-gray-200 pt-sm pb-sm px-base h-fit;
}
</style>
