<template>
  <v-section :fullHeight="props.fullHeight" :noPadding="props.noPadding" class="flex flex-row items-center justify-center">
    <div class="flex flex-col items-center justify-center w-full">
      <h1 :class="['mb-md text-center', props.darkMode ? 'text-white' : 'text-typography_secondary']" v-html="$t(props.title)" />
      <h2 :class="['text-center text-h3', props.darkMode ? 'text-white' : 'text-typography_secondary']" v-html="$t(props.subtitle)" />
      <div v-if="$slots.buttons" class="flex flex-row items-center justify-center mt-xl text-h5">
        <slot name="buttons"></slot>
      </div>
      <slot />
    </div>
  </v-section>
</template>

<script setup>
import vSection from '@/components/section.vue';

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
  },
  darkMode: {
    type: Boolean,
    default: false
  }
});
</script>
