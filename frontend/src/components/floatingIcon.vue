<template>
    <div
        v-if="isOpen"
        v-click-outside="handleClickOutside"
        :class="[
            'fixed bottom-0 right-0 mb-14 mr-xs shadow-2xl p-xs rounded-md icon--content',
            props.format === 'error' ? 'bg-red-500' : '',
            props.format === 'primary' ? 'bg-brand_tertiary' : ''
        ]"
    >
        <slot name="content" />
    </div>
    <div
        :class="[
            'fixed text-lg bottom-0 right-0 mb-xs mr-xs h-10 w-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer duration-300',
            props.format === 'error' ? 'bg-red-400 hover:bg-red-600' : '',
            props.format === 'primary' ? 'bg-brand_tertiary hover:bg-brand_secondary hover:text-white' : '',
            !isOpen ? '' : ''
        ]"
        @click="toggleInfo"
    >
        <slot v-if="!isOpen" name="icon" />
        <ChevronUpIcon v-else class="w-8 h-8" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronUpIcon } from '@heroicons/vue/solid';

const props = defineProps({
    format: {
        type: String,
        default: 'error'
    }
});

const openTimestamp = ref(undefined);

const isOpen = ref(false);
const toggleInfo = () => {
    openTimestamp.value = Date.now();
    isOpen.value = !isOpen.value;
};

const handleClickOutside = () => {
    // Only close if at least a couple of millis passed, otherwise it gets triggered by the open event
    if (openTimestamp.value === undefined || Date.now() - openTimestamp.value > 1000 * 0.5) {
        isOpen.value = false;
    }
};
</script>

<style scoped>
.icon--content {
    max-width: 200px;
}
</style>
