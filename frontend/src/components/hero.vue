<template>
    <v-section :fullHeight="fullHeight" :noPadding="noPadding" class="flex flex-row items-center justify-center">
        <div class="flex flex-col items-center justify-center w-full">
            <h1 :class="['mb-md text-center', darkMode ? 'text-white' : 'text-typography_secondary']" v-html="$t(title)" />
            <h2 :class="['text-center text-h3', darkMode ? 'text-white' : 'text-typography_secondary']" v-html="$t(subtitle)" />
            <div v-if="$slots.buttons" class="flex flex-row items-center justify-center mt-xl text-h5">
                <slot name="buttons"></slot>
            </div>
            <slot />
        </div>
    </v-section>
</template>

<script setup>
import vSection from '@/components/section.vue';

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
    darkMode: {
        type: Boolean,
        default: false
    }
});
</script>
