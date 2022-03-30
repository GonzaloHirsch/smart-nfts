<template>
  <Disclosure v-slot="{ open }">
    <DisclosureButton
      :class="[formats.button, 'flex justify-between w-full px-sm md:px-base py-sm text-left rounded-lg outline-none relative', props.class, open ? 'disclosure--open' : 'disclosure--closed']"
      style="z-index: 2"
      :id="props.customId"
    >
      <div class="flex flex-row items-center h-full w-full">
        <div class="flex flex-col mr-xs md:mr-sm">
          <span class="text-body_sm sm:text-base lg:text-body_xl">{{ props.title }}</span>
          <span v-if="props.error" class="text-error text-body_xs sm:text-body_sm lg:text-body_md">{{ props.error }}</span>
        </div>
        <slot name="header" />
      </div>
      <ChevronUpIcon :class="[$slots.content ? '' : 'invisible', open ? '' : 'transform rotate-180', 'transition duration-200 w-8 h-8 my-auto']" />
    </DisclosureButton>
    <DisclosurePanel
      v-if="$slots.content"
      :class="[formats.content, 'px-sm md:px-base py-sm rounded-md transform accordion--panel relative']"
      style="z-index: 1"
    >
      <slot name="content" />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronUpIcon } from '@heroicons/vue/solid';
import { computed } from 'vue';

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
  },
  error: {
    type: String,
    default: undefined
  },
  customId: {
    type: String,
    default: undefined
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

.accordion--panel {
  @apply -translate-y-sm;
}
</style>
