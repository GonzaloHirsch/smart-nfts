<template>
    <div class="flex flex-col items-center bg-white rounded-lg border border-gray-200 token--wrapper overflow-hidden">
        <div class="token--image-wrapper">
            <!-- <template v-if="tokenInfo.image && (!isLoadingImage || !startedLoadingImage)"> -->
            <template v-if="tokenInfo.image && imageUrl">
                <img class="token--image" :src="imageUrl" :alt="`Image for the ${tokenInfo.name} token`" />
            </template>
            <template v-else>
                <div :class="['token--image w-full p-xl', imageError ? 'bg-error/25' : 'bg-light']">
                    <v-ethereum class="w-fit" />
                </div>
            </template>
        </div>
        <div class="p-sm text-sm flex flex-col items-center w-full">
            <div class="flex flex-row w-full items-center justify-between">
                <span :class="['text-sm', loadingContent ? 'loading--text loading--name' : '']">{{ tokenInfo.name || null }}</span>
                <span v-if="props.id" class="text-sm text-brand_secondary">#{{ props.id }}</span>
            </div>
            <p
                :class="[
                    'text-sm mt-xs line-clamp-none sm:line-clamp-3 w-full card--description',
                    loadingContent ? 'loading--text loading--description' : ''
                ]"
            >
                {{ tokenInfo.description || null }}
            </p>
        </div>
        <div v-if="props.id && props.contractAddress" class="border-t border-gray-400 w-full px-sm py-xs flex flex-row">
            <a
                :href="`https://${props.network}.etherscan.io/token/${props.contractAddress}?a=${props.id}`"
                target="_blank"
                rel="noopener noreferer"
                class="block"
            >
                <v-etherscan-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </a>
            <a
                v-if="props.showOpensea"
                :href="`https://testnets.opensea.io/assets/${props.contractAddress}/${props.id}`"
                target="_blank"
                rel="noopener noreferer"
                class="block ml-xs"
            >
                <v-opensea-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </a>
        </div>
    </div>
</template>

<script setup>
import vEthereum from '@/assets/images/icons/ethereum.svg?component';
import vOpenseaLogo from '@/assets/images/icons/opensea.svg?component';
import vEtherscanLogo from '@/assets/images/icons/etherscan.svg?component';

import { onMounted, ref } from 'vue';

import { useIpfs } from '@/plugins/ipfs';
const ipfs = useIpfs();

const props = defineProps({
    owner: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    token: {
        type: Object,
        default: {}
    },
    showOpensea: {
        type: Boolean,
        default: false
    },
    network: {
        type: String,
        required: true
    }
});

const tokenInfo = ref({});
const loadingContent = ref(true);
const imageUrl = ref(undefined);
const loadingImage = ref(true);
const imageError = ref(false);

onMounted(() => {
    loadingContent.value = true;
    ipfs.getJSONContent(props.hash).then((res) => {
        tokenInfo.value = res.data;
        loadingContent.value = false;
        // Load image if in the object
        if (tokenInfo.value.image) {
            loadingImage.value = true;
            ipfs.getImageContent(ipfs.clearGateUri(tokenInfo.value.image))
                .then((res) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(res.data);
                    reader.onload = () => {
                        imageError.value = false;
                        loadingImage.value = false;
                        imageUrl.value = reader.result;
                    };
                })
                .catch((err) => {
                    console.error(err);
                    imageError.value = true;
                });
        }
    });
});

const getImageUri = (hash) => {
    startedLoadingImage.value = true;
    loadingImage.value = true;
    return ipfs.getImageUri(ipfs.clearGateUri(hash));
};

const handleImageLoad = () => {
    console.log('LOADED');
    // loadingImage.value = false;
};
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

.loading--text {
    @apply animate-pulse bg-gray-400 w-full rounded-sm;
}

.loading--name {
    @apply h-5 mr-xl;
}

.loading--description {
    height: 60px;
}

.card--description {
    min-height: 60px;
}
</style>
