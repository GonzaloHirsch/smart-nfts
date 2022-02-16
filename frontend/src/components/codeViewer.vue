<template>
    <div class="relative code-viewer rounded-md bg-slate-800 text-white h-full overflow-hidden">
        <div :class="['overflow-x-auto overflow-y-auto justify-start items-start relative', props.loading ? '' : 'h-full']">
            <pre v-if="!props.loading" class="flex h-full">
                <code ref="contractCode" class="language-solidity w-full p-sm ">
                    {{props.code}}
                </code>
            </pre>
        </div>
        <div v-if="!props.loading && props.canDownload" class="absolute flex top-0 right-0">
            <!-- <div v-if="!props.loading && props.canDownload" class="absolute flex top-0 right-0"> -->
            <div
                @click="!props.loadingCopy ? copyContract() : undefined"
                :class="[
                    'p-1 border-2 transition duration-200 rounded-bl-md',
                    props.loadingCopy
                        ? 'bg-gray-500 text-gray-700 border-gray-700 cursor-not-allowed'
                        : 'border-gray-500 bg-gray-400 text-gray-500 hover:text-brand_secondary hover:border-brand_secondary hover:bg-white cursor-pointer'
                ]"
                :aria-label="$t('aria.copyContract')"
                :aria-disabled="props.loadingCopy"
            >
                <DocumentDuplicateIcon v-if="!props.loadingCopy" class="h-8 w-8" />
                <RefreshIcon v-else class="h-8 w-8 animate-spin-reverse" />
            </div>
            <div
                @click="!props.loadingDownload ? downloadContract() : undefined"
                :class="[
                    'p-1 border-2 transition duration-200',
                    props.loadingDownload
                        ? 'bg-gray-500 text-gray-700 border-gray-700 cursor-not-allowed'
                        : 'border-gray-500 bg-gray-400 text-gray-500 hover:text-brand_secondary hover:border-brand_secondary hover:bg-white cursor-pointer'
                ]"
                :aria-label="$t('aria.downloadContract')"
                :aria-disabled="props.loadingDownload"
            >
                <DownloadIcon v-if="!props.loadingDownload" class="h-8 w-8" />
                <RefreshIcon v-else class="h-8 w-8 animate-spin-reverse" />
            </div>
        </div>
        <div v-else-if="props.loading" class="w-full flex flex-col items-center justify-center h-full">
            <RefreshIcon class="h-12 w-12 animate-spin-reverse mx-auto my-auto" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { RefreshIcon, DocumentDuplicateIcon, DownloadIcon } from '@heroicons/vue/solid';

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const emit = defineEmits(['downloadContract']);
const props = defineProps({
    code: {
        type: String,
        default: undefined
    },
    loading: {
        type: Boolean,
        default: false
    },
    canDownload: {
        type: Boolean,
        default: false
    },
    loadingDownload: {
        type: Boolean,
        default: false
    }
});

const downloadContract = () => {
    emit('downloadContract');
};

const loadingCopy = ref(false);
const copyContract = () => {
    loadingCopy.value = true;
    if (!navigator.clipboard) {
        setSnackbar('Cannot copy contract code to clipboard!', 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(props.code)
        .then(() => {
            setSnackbar('Copied to clipboard!', 'default', 5);
            loadingCopy.value = false;
        })
        .catch((err) => {
            console.error(err);
            setSnackbar('Cannot copy contract code to clipboard!', 'error', 5);
            loadingCopy.value = false;
        });
};

// Ref to access the element
const contractCode = ref(null);
const formatCode = () => {
    if (props.code && contractCode.value) {
        hljs.highlightElement(contractCode.value);
    }
};
// Watch for changes and style again
watch(
    () => props.loading,
    async () => {
        // We need to wait for next tick so that it's done loading
        if (!props.loading) {
            await nextTick();
            formatCode();
        }
    },
    {
        immediate: true
    }
);
</script>

<style scoped>
.code-viewer {
    @apply h-auto shadow-2xl !important;
    max-height: 100vh;
}

@screen md {
    .code-viewer {
        max-height: none;
    }
}
</style>
