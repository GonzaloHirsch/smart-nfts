<template>
    <section :style="sectionStyle" :class="[props.noPadding ? '' : 'px-sm md:px-md lg:px-xl py-sm md:py-md lg:py-xl']">
        <slot/>
    </section>
</template>

<script setup>
import {inject, computed} from 'vue';
import { NAV_HEIGHT } from "@/js/constants.js";

const props = defineProps({
    fullHeight: {
        type: Boolean,
        default: false
    },
    noPadding: {
        type: Boolean,
        default: false
    }
});

const navHeight = inject(NAV_HEIGHT);
const sectionStyle = computed(() => props.fullHeight ? (navHeight.value ? {height: `calc(100vh - ${navHeight.value}px)`} : {height: `100vh`}) : {});
</script>
