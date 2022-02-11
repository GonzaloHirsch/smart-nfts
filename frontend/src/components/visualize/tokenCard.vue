<template>
    <div class="flex flex-col items-center bg-white rounded-lg border border-gray-200 token--wrapper overflow-hidden">
        <div class="token--image-wrapper">
            <template v-if="props.token.image">
                <img class="token--image" :src="props.token.image" :alt="`Image for the ${props.token.name} token`" />
            </template>
            <template v-else>
                <div class="token--image w-full bg-light p-xl">
                    <v-ethereum class="w-fit" />
                </div>
            </template>
        </div>
        <div class="p-sm text-sm flex flex-col items-center w-full">
            <div class="flex flex-row w-full items-center justify-between">
                <span class="text-sm">{{ props.token.name }}</span>
                <span class="text-sm text-brand_secondary">#{{ props.token.id }}</span>
            </div>
            <p class="text-sm mt-xs">{{ props.token.description }}</p>
        </div>
        <div class="border-t border-gray-400 w-full px-sm py-xs flex flex-row">
            <a href="https://etherscan.io/" target="_blank" rel="noopener noreferer" class="block">
                <v-etherscan-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </a>
            <a href="https://opensea.io/" target="_blank" rel="noopener noreferer" class="block ml-xs">
                <v-opensea-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </a>
        </div>
    </div>
</template>

<script setup>
import vEthereum from '@/assets/images/icons/ethereum.svg?component';
import vOpenseaLogo from '@/assets/images/icons/opensea.svg?component';
import vEtherscanLogo from '@/assets/images/icons/etherscan.svg?component';

const props = defineProps({
    token: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.token--image {
    @apply flex flex-row w-full items-center justify-center object-cover;
    aspect-ratio: 1 / 1;
}

.token--image-wrapper {
    @apply w-full;
}

.token--wrapper {
    @apply shadow-lg !important;
}
</style>
