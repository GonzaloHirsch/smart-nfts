<template>
    <div class="overflow-x-auto overflow-y-auto code-viewer justify-start items-start rounded-md bg-slate-800 text-white">
        <pre v-if="!props.loading">
      <code ref="contractCode" class="language-solidity">
        {{props.code}}
      </code>
    </pre>
        <div v-else class="w-full flex flex-col items-center justify-center h-full">
            <RefreshIcon class="h-12 w-12 animate-spin-reverse mx-auto my-auto" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { RefreshIcon } from '@heroicons/vue/solid';

const props = defineProps({
    code: {
        type: String,
        default: undefined
    },
    loading: {
        type: Boolean,
        default: false
    }
});

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
