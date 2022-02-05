<template>
  <v-section :fullHeight="props.fullHeight" :noPadding="props.noPadding" class="flex flex-wrap flex-row md:flex-nowrap items-start justify-center">
    <div class="flex flex-col items-center md:items-start justify-center w-full md:w-6/12 md:h-full">
      <h1 class="text-brand_secondary mb-sm text-center md:text-left w-full text-h4 md:text-h2" v-html="$t(props.title)" />
      <div v-if="$slots.buttons" class="flex flex-row items-center md:items-start justify-center mt-sm text-h5">
        <slot name="buttons"></slot>
      </div>
      <slot />
    </div>
    <div class="w-full md:w-6/12 flex flex-col items-center md:items-end justify-center md:h-full relative mt-base md:mt-0">
      <v-main-drawing class="hero-main-drawing"/>
      <v-background-drawing class="hidden md:block hero-background-drawing transform rotate-45"/>
    </div>
  </v-section>
</template>

<script setup>
import vSection from '@/components/section.vue';

import vMainDrawing from '@/assets/images/Main-Drawing.svg?component';
import vBackgroundDrawing from '@/assets/images/Background-Drawing.svg?component';

const props = defineProps({
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
  }
});
</script>
