<template>
    <div
        v-if="!props.enlarged"
        class="flex flex-col items-center bg-white rounded-lg border border-gray-200 token--wrapper overflow-hidden hover:shadow-xl hover:-translate-y-1 duration-200 transform cursor-pointer"
        @click="handleCardClick"
    >
        <div class="token--image-wrapper">
            <template v-if="tokenInfo.image && imageUrl">
                <img class="token--image" :src="imageUrl" :alt="`Image for the ${tokenInfo.name} token`" />
            </template>
            <template v-else>
                <div :class="['token--image w-full p-xl', loadingImage ? 'bg-light animate-pulse' : imageError ? 'bg-error/25' : 'bg-light']">
                    <v-ethereum class="w-fit" />
                </div>
            </template>
        </div>
        <div class="p-sm text-sm flex flex-col items-center w-full">
            <div class="flex flex-row w-full items-center justify-between">
                <span :class="['text-lg', loadingContent ? 'loading--text loading--name' : '']">{{ tokenInfo.name || null }}</span>
                <span v-if="props.id" class="text-lg text-brand_secondary">#{{ props.id }}</span>
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
            <span @click.stop="handleNavigation(`https://${props.network}.etherscan.io/token/${props.contractAddress}?a=${props.id}`)" class="block">
                <v-etherscan-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </span>
            <span
                v-if="props.showOpensea"
                @click.stop="handleNavigation(`https://testnets.opensea.io/assets/${props.contractAddress}/${props.id}`)"
                class="block ml-xs"
            >
                <v-opensea-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
            </span>
        </div>
    </div>
    <div v-else class="flex flex-col items-center bg-transparent token-enlarged--wrapper">
        <div class="grid grid-cols-10 gap-sm">
            <div class="token-enlarged--image-wrapper col-span-full md:col-span-4">
                <template v-if="tokenInfo.image && imageUrl">
                    <img class="token--image" :src="imageUrl" :alt="`Image for the ${tokenInfo.name} token`" />
                </template>
                <template v-else>
                    <div :class="['token--image w-full p-xl', loadingImage ? 'bg-light animate-pulse' : imageError ? 'bg-error/25' : 'bg-light']">
                        <v-ethereum class="w-fit" />
                    </div>
                </template>
                <div
                    v-if="props.id && props.contractAddress"
                    class="border-2 rounded-b-lg border-gray-400 w-full px-xs py-xs flex flex-row -mt-[2px] justify-between"
                >
                    <div class="flex">
                        <span
                            @click.stop="handleNavigation(`https://${props.network}.etherscan.io/token/${props.contractAddress}?a=${props.id}`)"
                            class="block"
                        >
                            <v-etherscan-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
                        </span>
                        <span
                            v-if="props.showOpensea"
                            @click.stop="handleNavigation(`https://testnets.opensea.io/assets/${props.contractAddress}/${props.id}`)"
                            class="block ml-xs"
                        >
                            <v-opensea-logo class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
                        </span>
                    </div>
                    <div class="flex">
                        <span
                            v-if="props.hash"
                            @click.stop="handleNavigation(`${getIpfsLink(props.hash)}`)"
                            class="block ml-xs"
                        >
                            <CodeIcon class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
                        </span>
                        <span
                            v-if="tokenInfo.image"
                            @click.stop="handleNavigation(`${getIpfsLink(tokenInfo.image)}`)"
                            class="block ml-xs"
                        >
                            <LinkIcon class="w-6 h-6 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-sm flex flex-col items-center justify-between w-full col-span-full md:col-span-6">
                <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full items-center justify-between">
                        <span :class="['text-h5', loadingContent ? 'loading--text loading--name' : '']">{{ tokenInfo.name || null }}</span>
                        <span v-if="props.id" class="text-h5 text-brand_secondary">#{{ props.id }}</span>
                    </div>
                    <p :class="['text-lg mt-xs w-full card--description line-clamp-6', loadingContent ? 'loading--text loading--description' : '']">
                        {{ tokenInfo.description || null }}
                    </p>
                </div>
                <p class="break-all text-left w-full mt-xs">
                    Owned by
                    <a
                        class="text-brand_secondary underline"
                        :href="`https://${props.network}.etherscan.io/address/${props.owner}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ props.owner.slice(0, 16) }}...</a
                    >
                </p>
            </div>
            <div v-if="properties" class="col-span-full">
                <p class="text-lg mb-xs"><strong>Properties</strong></p>
                <div class="flex flex-row flex-wrap">
                    <template v-for="(property, index) in properties" :key="index">
                        <v-token-trait :value="property.value" :name="property.trait_type" class="mr-xs mb-xs" />
                    </template>
                </div>
            </div>
            <div v-if="stats" class="col-span-full">
                <p class="text-lg mb-xs"><strong>Stats</strong></p>
                <div class="flex flex-row flex-wrap">
                    <template v-for="(property, index) in stats" :key="index">
                        <v-token-trait :value="property.value" :name="property.trait_type" class="mr-xs mb-xs" />
                    </template>
                </div>
            </div>
            <div v-if="boosts" class="col-span-full">
                <p class="text-lg mb-xs"><strong>Boosts</strong></p>
                <div class="flex flex-row flex-wrap">
                    <template v-for="(property, index) in boosts" :key="index">
                        <v-token-boost
                            :value="property.value"
                            :name="property.trait_type"
                            :isPercentage="property.display_type === 'boost_percentage'"
                            :radius="50"
                            :stroke="8"
                            class="mx-auto md:ml-0 md:mr-xs mb-xs"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import vEthereum from '@/assets/images/icons/ethereum.svg?component';
import vOpenseaLogo from '@/assets/images/icons/opensea.svg?component';
import vEtherscanLogo from '@/assets/images/icons/etherscan.svg?component';
import vTokenTrait from '@/components/visualize/tokenTrait.vue';
import vTokenBoost from '@/components/visualize/tokenBoost.vue';
import { CodeIcon, LinkIcon } from '@heroicons/vue/solid';

import { onMounted, ref, computed } from 'vue';

import { useIpfs } from '@/plugins/ipfs';
const ipfs = useIpfs();

const emit = defineEmits(['ipfsError', 'cardClicked']);

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
    },
    enlarged: {
        type: Boolean,
        default: false
    }
});

const tokenInfo = ref({});
const loadingContent = ref(true);
const imageUrl = ref(undefined);
const loadingImage = ref(true);
const imageError = ref(false);

const properties = computed(() => (tokenInfo.value.attributes ? tokenInfo.value.attributes.filter((att) => !att.display_type) : []));
const stats = computed(() => (tokenInfo.value.attributes ? tokenInfo.value.attributes.filter((att) => att.display_type === 'number') : []));
const boosts = computed(() =>
    tokenInfo.value.attributes
        ? tokenInfo.value.attributes.filter((att) => att.display_type === 'boost_number' || att.display_type === 'boost_percentage')
        : []
);

onMounted(() => {
    loadingContent.value = true;
    ipfs.getJSONContent(props.hash)
        .then((res) => {
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
                        emit('ipfsError');
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            emit('ipfsError');
        });
});

const handleCardClick = () => {
    emit('cardClicked', props.id);
};

const handleNavigation = (url) => {
    window.open(url, '_blank').focus();
};

const getIpfsLink = (hash) => {
    return ipfs.getImageUri(ipfs.clearGateUri(hash));
}
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
    @apply shadow-lg;
}

.loading--text {
    @apply animate-pulse bg-gray-400 w-full rounded-sm;
}

.loading--name {
    @apply h-7 mr-xl;
}

.loading--description {
    height: 60px;
}

.card--description {
    min-height: 60px;
}

/* ENLARGED */
.token-enlarged--wrapper .card--description {
    min-height: 56px;
}

@screen md {
    .token-enlarged--wrapper .card--description {
        min-height: 168px;
    }
}

.token-enlarged--image-wrapper {
    @apply overflow-hidden rounded-lg;
    max-width: 350px;
}

@screen md {
    .token-enlarged--image-wrapper {
        max-width: 400px;
    }
}
</style>
