<template>
    <v-section
        :noPadding="true"
        :class="[(!validContract || (!contractIsDeployed && hasContract)) && !isLoading ? 'bg-gradient-to-b from-error to-white' : '']"
    >
        <form class="grid grid-cols-10 gap-sm p-sm" autocomplete="off">
            <div class="col-span-full entire-panel">
                <div class="flex flex-row justify-between items-center">
                    <h2 class="text-left text-brand_secondary">Contract</h2>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-sm p-sm">
            <template v-for="(token, index) in tokens" :key="index">
                <v-token-card :token="token" class="col-span-1"/>
            </template>
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
const contractIsDeployed = computed(
    () =>
        hasContract.value &&
        contract.value.deployment?.address !== null &&
        contract.value.deployment?.address !== undefined &&
        contract.value.deployment?.address !== ''
);

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

const tokens = [
    {
        image: 'https://picsum.photos/200/300',
        name: 'Test 1',
        id: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    },
    {
        image: 'https://picsum.photos/200/300',
        name: 'Test 2',
        id: 2,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    },
    {
        name: 'Test 3',
        id: 3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    },
    {
        image: 'https://picsum.photos/200/300',
        name: 'Test 4',
        id: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    },
    {
        name: 'Test 5',
        id: 5,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    },
    {
        image: 'https://picsum.photos/200/300',
        name: 'Test 6',
        id: 6,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        metadata: [
            {
                traitType: 'Family',
                value: 'Testensons'
            },
            {
                traitType: 'Generation',
                value: 34,
                displayType: 'number'
            },
            {
                traitType: 'Strength',
                value: 23,
                displayType: 'boost_number'
            },
            {
                traitType: 'Intelligence',
                value: 77,
                displayType: 'boost_percentage'
            }
        ]
    }
];

// Meta
import { useMeta } from 'vue-meta';
useMeta({
    title: 'Visualize Tokens',
    description: ''
});
</script>

<style>
.entire-panel {
    @apply flex flex-col bg-light rounded-md shadow-lg border border-gray-200 pt-sm pb-sm px-base h-fit;
}
</style>
