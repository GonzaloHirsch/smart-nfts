<template>
  <v-section :fullHeight="props.fullHeight" :noPadding="props.noPadding" class="flex flex-row items-center justify-center">
    <div class="flex flex-col items-center justify-center w-full">
      <h1 class="text-typography_primary mb-md text-center" v-html="$t(props.title)" />
      <h2 class="text-typography_primary text-center text-h3" v-html="$t(props.subtitle)" />
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
  }
});
</script>
