<template>
    <div class="flex flex-row items-center justify-center p-xs md:p-md">
        <div class="bg-brand_secondary w-full rounded-lg text-typography_primary">
            <h4 class="block my-base px-sm py-xl text-h5 md:text-h4 text-center">
                {{ $t(text) }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180 inline" />
            </h4>
        </div>
    </div> 
</template>

<script setup>
import { RefreshIcon } from '@heroicons/vue/solid';

defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>
