<template>
    <div v-if="!isLoading" class="flex flex-col">
        <template v-if="validContract && hasContract && contractDeployed">
            <template v-for="(method, index) in abi" :key="`${index}`">
                <v-method-accordion
                    :method="method"
                    class="mb-xs"
                    :isMint="isMint"
                    :metadata="metadata"
                    :network="network"
                    :defaultAddress="defaultAddress"
                />
            </template>
        </template>
        <template v-else-if="!validContract">
            <div
                class="bg-red-500 text-center text-typography_primary my-auto mx-auto h-20 px-xl rounded-md flex flex-col items-center justify-center"
            >
                {{ $t('interact.error.invalidContract') }}
            </div>
        </template>
        <template v-else-if="!contractDeployed && hasContract">
            <div
                class="bg-red-500 text-center text-typography_primary my-auto mx-auto h-20 px-xl rounded-md flex flex-col items-center justify-center"
            >
                {{ $t('interact.error.contractNotDeployed') }}
            </div>
        </template>
        <template v-else-if="!hasContract">
            <div class="my-auto mx-auto flex flex-col items-center justify-center text-h5 text-center">
                {{ $t('interact.loading.initialMethods') }}
            </div>
        </template>
    </div>
    <div v-else class="w-full flex flex-row items-center justify-center h-full mx-auto my-auto">
        <span class="text-h5">{{ $t('interact.loading.methods') }}</span
        ><RefreshIcon class="h-12 w-12 animate-spin-reverse" />
    </div>
</template>

<script setup>
import vMethodAccordion from '@/components/interaction/methodAccordion.vue';
import vButton from '@/components/button.vue';
import { RefreshIcon } from '@heroicons/vue/solid';

defineProps({
    abi: {
        type: Array,
        default: []
    },
    validContract: {
        type: Boolean,
        default: true
    },
    hasContract: {
        type: Boolean,
        default: false
    },
    contractDeployed: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: Object,
        default: undefined
    },
    isMint: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    network: {
        type: String,
        required: false,
        default: undefined
    },
    defaultAddress: {
        type: String,
        required: false,
        default: undefined
    }
});
</script>
