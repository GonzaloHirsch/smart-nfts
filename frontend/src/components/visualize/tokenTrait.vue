<template>
    <div
        class="flex flex-col items-center justify-center h-auto py-xs px-xs bg-brand_tertiary/10 border border-brand_secondary rounded-md token-trait"
    >
        <span class="block text-sm text-brand_secondary break-all">{{ name }}</span>
        <span class="block font-semibold text-center break-all">{{ value }}</span>
    </div>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});
</script>

<style scoped>
.token-trait {
    @apply shadow-md shadow-brand_primary !important;
}
</style>
