<template>
    <div class="flex flex-col items-center justify-center h-auto py-xs px-base bg-brand_primary border border-brand_secondary rounded-md w-fit">
        <span class="block text-sm text-brand_secondary">{{props.name}}</span>
        <span class="block font-semibold">{{props.value}}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})
</script>
