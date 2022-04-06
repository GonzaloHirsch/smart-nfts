<template>
    <Popper class="tooltip" :content="text" :hover="true" :placement="positionY" :arrow="true">
        <slot />
    </Popper>
</template>

<script setup>
import Popper from 'vue3-popper';

defineProps({
    text: {
        type: String,
        required: true
    },
    positionY: {
        type: String,
        default: 'top'
    }
});
</script>

<style scoped>
:deep(.popper) {
    @apply bg-gray-800 p-2 rounded text-white;
}

:deep(.popper #arrow::before) {
    @apply bg-gray-800;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
    @apply bg-gray-800;
}

/* .tooltip {
    @apply border-2 !important;
    margin: -2px !important;
} */
</style>
