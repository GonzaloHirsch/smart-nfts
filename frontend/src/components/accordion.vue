<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      :class="[formats.button, 'flex justify-between w-full px-base py-sm text-left rounded-lg outline-none relative', props.class]"
      style="z-index: 2"
    >
      <div class="flex flex-row items-center h-full w-full">
        <span class="mr-sm text-base md:text-body_xl">{{ props.title }}</span>
        <slot name="header" />
      </div>
      <ChevronUpIcon :class="[$slots.content ? '' : 'invisible', open ? '' : 'transform rotate-180', 'transition duration-200 w-8 h-8']" />
    </DisclosureButton>
    <DisclosurePanel
      v-if="$slots.content"
      :class="[formats.content, 'px-base py-sm rounded-md transform -translate-y-sm relative']"
      style="z-index: 1"
    >
      <slot name="content" />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronUpIcon } from '@heroicons/vue/solid';
import { computed, ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  class: {
    type: String
  },
  format: {
    type: String,
    default: 'light'
  }
});

const formats = computed(() => {
  return { content: `accordion--content-${props.format}`, button: `accordion--button-${props.format}` };
});
</script>

<style scoped>
.accordion--button-light {
  @apply bg-light text-typography_secondary shadow-sm border border-gray-200 !important;
}

.accordion--content-light {
  @apply bg-typography_secondary text-typography_primary;
}

.accordion--button-white {
  @apply bg-white text-typography_secondary shadow-sm border border-gray-200 !important;
}

.accordion--content-white {
  @apply bg-typography_secondary text-typography_primary;
}

.accordion--button-primary {
  @apply bg-white text-typography_secondary shadow-sm border border-gray-200 !important;
}

.accordion--content-primary {
  @apply bg-brand_primary text-typography_primary;
}
</style>
