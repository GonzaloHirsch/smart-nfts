<template>
    <v-section :fullHeight="fullHeight" :noPadding="noPadding" class="flex flex-wrap flex-row md:flex-nowrap items-start justify-center">
        <div class="flex flex-col items-center md:items-start justify-center w-full md:w-6/12 md:h-full">
            <h1 class="text-brand_secondary mb-sm text-center md:text-left w-full text-h4 md:text-h2" v-html="$t(title)" />
            <h2 v-if="subtitle" class="text-brand_secondary mb-sm text-center md:text-left w-full text-body_xl md:text-h5" v-html="$t(subtitle)" />
            <div v-if="$slots.buttons" class="flex flex-row items-center md:items-start justify-center mt-sm text-h5">
                <slot name="buttons"></slot>
            </div>
            <slot />
        </div>
        <div class="w-full md:w-6/12 flex flex-col items-center md:items-end justify-center md:h-full relative mt-base md:mt-0">
            <v-main-drawing v-if="isHome" class="hero-main-drawing" />
            <v-about-us-drawing v-if="!isHome" class="hero-main-drawing" />
            <v-circle-drawing class="hero-background-drawing" />
        </div>
    </v-section>
</template>

<script setup>
import vSection from '@/components/section.vue';

import vMainDrawing from '@/assets/images/Main-Drawing.vue';
import vAboutUsDrawing from '@/assets/images/About-Us-Drawing.vue';
import vCircleDrawing from '@/assets/images/Circle-Drawing.vue';

defineProps({
    fullHeight: {
        type: Boolean,
        default: false
    },
    noPadding: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    isHome: {
        type: Boolean
    }
});
</script>
