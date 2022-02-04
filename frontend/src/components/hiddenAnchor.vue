<template>
  <div class="relative">
    <span :id="props.anchor" class="hidden-anchor" :style="anchorStyle"></span>
  </div>
</template>

<script setup>
import { NAV_HEIGHT } from '@/js/constants.js';
import { computed, inject } from 'vue';
const props = defineProps({
  anchor: {
    type: String,
    required: true
  },
  distanceMultiplier: {
    type: Number,
    default: 1
  }
});

// Anchor Style
const navHeight = inject(NAV_HEIGHT);
const anchorStyle = computed(() => {
  return navHeight.value ? { top: `-${navHeight.value * props.distanceMultiplier}px` } : { top: '0' };
});
</script>

<style scoped>
.hidden-anchor {
  @apply absolute left-0;
}
</style>
