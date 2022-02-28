<template>
  <section :style="sectionStyle" :class="[props.noPadding ? '' : (props.smallPadding ? 'px-base md:px-xl lg:px-2xl py-sm md:py-base' : 'px-base md:px-xl lg:px-2xl py-base md:py-xl lg:py-3xl')]">
    <slot />
  </section>
</template>

<script setup>
import { inject, computed } from 'vue';
import { NAV_HEIGHT } from '@/js/constants.js';

const props = defineProps({
  fullHeight: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  smallPadding: {
    type: Boolean,
    default: false
  }
});

const navHeight = inject(NAV_HEIGHT);
const sectionStyle = computed(() =>
  props.fullHeight
    ? navHeight.value
      ? { height: `calc(100vh - ${navHeight.value}px)`, minHeight: `calc(100vh - ${navHeight.value}px)` }
      : { height: `100vh`, minHeight: `100vh` }
    : {}
);
</script>
