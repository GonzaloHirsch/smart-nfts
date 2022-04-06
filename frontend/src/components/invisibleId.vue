<template>
    <div class="relative">
        <span :id="props.anchor" class="absolute left-0" :style="anchorStyle"></span>
    </div>
</template>

<script setup>
import { NAV_HEIGHT } from '@/js/constants.js';
import { computed, inject } from 'vue';

const props = defineProps({
    anchor: {
        type: String,
        required: true
    },
    offset: {
        type: Number,
        default: 0
    }
});

// Anchor Style
const navHeight = inject(NAV_HEIGHT);
const anchorStyle = computed(() => {
    return navHeight.value ? { top: `-${navHeight.value + props.offset}px` } : { top: '0' };
});
</script>
