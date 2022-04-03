<template>
    <div class="flex flex-row">
        <div class="information-item--icon-wrapper">
            <slot name="icon" />
        </div>
        <div class="flex flex-col ml-sm w-full">
            <h5 class="text-lg">{{ title }}</h5>
            <p v-if="description" class="mt-1 text-sm break-all">{{ description }}</p>
        </div>
        <div v-if="showActions" class="flex flex-row items-center justify-end pl-sm">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    showActions: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
.information-item--icon-wrapper {
    @apply bg-gray-400 p-xs my-auto;
    border-radius: 50%;
}
</style>
