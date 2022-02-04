<template>
    <div class="flex flex-col lg:flex-row w-full items-center">
        <div class="w-full lg:w-7/12 pt-20 sm:pt-20 md:pt-20 lg:pt-16 xl:pt-8">
            <slot name="content" />
            <div class="mt-sm">
                <slot name="bottom" />
            </div>
        </div>
        <div class="w-full lg:w-5/12 fc--image-wrapper flex justify-center items-center relative mt-base lg:mt-0">
            <div class="w-full h-full bg-brand_primary absolute image-background top-0 left-0 right-0 bottom-0 mx-auto rounded-full z-0"></div>
            <slot name="image" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({});
</script>
