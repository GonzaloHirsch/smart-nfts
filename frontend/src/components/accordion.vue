<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      :class="[
        props.format === 'light' ? 'accordion--button-light' : '',
        props.format === 'white' ? 'accordion--button-white' : '',
        props.format === 'primary' ? 'accordion--button-primary' : '',
        'flex justify-between w-full px-base py-sm text-left rounded-md outline-none'
      ]"
      style="z-index: 2"
    >
      <div class="flex flex-row items-center">
        <span class="mr-sm">{{ props.title }}</span>
        <slot name="header" />
      </div>
      <ChevronUpIcon v-if="$slots.content" :class="open ? 'transform rotate-180' : ''" class="w-8 h-8" />
    </DisclosureButton>
    <DisclosurePanel
      v-if="$slots.content"
      :class="[
        props.format === 'light' ? 'accordion--content-light' : '',
        props.format === 'white' ? 'accordion--content-white' : '',
        props.format === 'primary' ? 'accordion--content-primary' : '',
        'px-base py-sm rounded-md -mt-xs'
      ]"
      style="z-index: 1"
    >
      <slot name="content" />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronUpIcon } from '@heroicons/vue/solid';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'light'
  }
});
</script>

<style scoped>
.accordion--button-light {
  @apply bg-light text-typography_secondary;
}

.accordion--content-light {
  @apply bg-typography_secondary text-typography_primary;
}

.accordion--button-white {
  @apply bg-white text-typography_secondary;
}

.accordion--content-white {
  @apply bg-typography_secondary text-typography_primary;
}

.accordion--button-primary {
  @apply bg-white text-typography_secondary;
}

.accordion--content-primary {
  @apply bg-brand_primary text-typography_primary;
}
</style>
