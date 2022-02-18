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
        <div class="p-sm text-sm flex flex-col items-center w-full" v-if="props.hash">
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
        <div v-if="props.id && props.contractAddress" class="border-t border-gray-400 w-full px-sm py-xs flex flex-row justify-between items-center">
            <div class="flex flex-row">
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
            <span v-if="props.id && !props.hash" class="text-lg text-brand_secondary">#{{ props.id }}</span>
        </div>
    </div>
    <div v-else class="flex flex-col items-center bg-transparent token-enlarged--wrapper">
        <div class="flex flex-col w-full items-center">
            <div :class="['token-enlarged--image-wrapper bg-brand_secondary relative', tokenInfo.image && imageUrl ? 'w-full' : 'w-[450px]']">
                <template v-if="tokenInfo.image && imageUrl">
                    <img class="token--image token-enlarged--image" :src="imageUrl" :alt="`Image for the ${tokenInfo.name} token`" />
                </template>
                <template v-else>
                    <div :class="['token--image token-enlarged--image w-full p-xl', loadingImage ? 'bg-light animate-pulse' : imageError ? 'bg-error/25' : 'bg-light']">
                        <v-ethereum class="w-fit" />
                    </div>
                </template>
                <span v-if="props.id" class="text-h4 text-white absolute top-0 left-0 pt-sm pl-sm">#{{ props.id }}</span>
            </div>
            <div class="flex flex-col items-center w-full px-sm">
                <span v-if="loadingContent || tokenInfo.name" :class="['text-h4 mt-sm', loadingContent ? 'loading--text loading-enlarged--name' : '']">{{ tokenInfo.name || null }}</span>
                <p v-if="loadingContent || tokenInfo.description" :class="['text-lg text-center my-base w-full text-gray-500', loadingContent ? 'loading--text loading--description' : '']">
                    {{ tokenInfo.description || null }}
                </p>
                <p v-if="!props.hash" class="text-lg text-center my-base w-full text-gray-500">This token has no metadata, click on the icons below to explore it on third-party services or view the owner.</p>
                <div v-if="props.id && props.contractAddress" class="w-full flex flex-row justify-between px-sm mb-base">
                    <span
                        @click.stop="handleNavigation(`https://${props.network}.etherscan.io/token/${props.contractAddress}?a=${props.id}`)"
                        class="block"
                    >
                        <v-etherscan-logo class="token-enlarged--icon" />
                    </span>
                    <span
                        v-if="props.showOpensea"
                        @click.stop="handleNavigation(`https://testnets.opensea.io/assets/${props.contractAddress}/${props.id}`)"
                        class="block ml-xs"
                    >
                        <v-opensea-logo class="token-enlarged--icon" />
                    </span>
                    <span
                        v-if="props.owner"
                        @click.stop="handleNavigation(`https://${props.network}.etherscan.io/address/${props.owner}`)"
                        class="block ml-xs"
                    >
                        <UserCircleIcon class="token-enlarged--icon" />
                    </span>
                    <span v-if="props.hash" @click.stop="handleNavigation(`${getIpfsLink(props.hash)}`)" class="block ml-xs">
                        <CodeIcon class="token-enlarged--icon" />
                    </span>
                    <span v-if="tokenInfo.image" @click.stop="handleNavigation(`${getIpfsLink(tokenInfo.image)}`)" class="block ml-xs">
                        <LinkIcon class="token-enlarged--icon" />
                    </span>
                </div>
            </div>

            <div v-if="properties && properties.length > 0" class="w-full">
                <div class="token-enlarged--metadata-field">Properties</div>
                <div class="flex flex-row flex-wrap items-center justify-center">
                    <template v-for="(property, index) in properties" :key="index">
                        <div class="w-6/12 md:w-4/12 p-xs">
                            <v-token-trait :value="property.value" :name="property.trait_type" />
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="stats && stats.length > 0" class="w-full">
                <div class="token-enlarged--metadata-field">Stats</div>
                <div class="flex flex-row flex-wrap items-center justify-center">
                    <template v-for="(property, index) in stats" :key="index">
                        <div class="w-6/12 md:w-4/12 p-xs">
                            <v-token-trait :value="property.value" :name="property.trait_type" />
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="boosts && boosts.length > 0" class="w-full mb-sm">
                <div class="token-enlarged--metadata-field">Boosts</div>
                <div class="flex flex-row flex-wrap items-center justify-center">
                    <template v-for="(property, index) in boosts" :key="index">
                        <div class="w-6/12 md:w-4/12 p-xs">
                            <v-token-boost
                                :value="property.value"
                                :name="property.trait_type"
                                :isPercentage="property.display_type === 'boost_percentage'"
                                :radius="50"
                                :stroke="8"
                            />
                        </div>
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
import { CodeIcon, LinkIcon, UserCircleIcon } from '@heroicons/vue/solid';

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
        required: false
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
    if (props.hash) {
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
    } else {
        loadingContent.value = false;
        loadingImage.value = false;
    }
});

const handleCardClick = () => {
    emit('cardClicked', props.id);
};

const handleNavigation = (url) => {
    window.open(url, '_blank').focus();
};

const getIpfsLink = (hash) => {
    return ipfs.getImageUri(ipfs.clearGateUri(hash));
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
.loading-enlarged--name {
    @apply h-7;
}

.token-enlarged--image {
    @apply border-4 border-white;
}

.token-enlarged--icon {
    @apply w-10 h-10 text-black/40 hover:text-brand_secondary transition duration-200 cursor-pointer;
}

.token-enlarged--metadata-field {
    @apply w-full py-xs text-lg font-semibold bg-brand_primary my-sm text-center;
}

.token-enlarged--wrapper .card--description {
    min-height: 56px;
}

.token-enlarged--image-wrapper .token--image {
    @apply rounded-lg;
}

.token-enlarged--image-wrapper .token--image {
    @apply mx-auto translate-y-1/2 rounded-lg;
    min-width: 150px;
    width: 45%;
}

.token-enlarged--image-wrapper {
    @apply max-w-md;
    margin-bottom: 25%;
}

@screen md {
    .token-enlarged--image-wrapper .token--image {
        @apply mx-auto translate-y-1/2;
        min-width: 200px;
        width: 45%;
    }

    .token-enlarged--image-wrapper {
        @apply max-w-md;
        margin-bottom: 25%;
    }
}

@screen md {
    .token-enlarged--wrapper .card--description {
        min-height: 168px;
    }
}
</style>
