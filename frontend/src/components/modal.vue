<template>
  <TransitionRoot appear as="template" :show="showModal">
    <Dialog :open="showModal" @close="emitClose" class="fixed inset-0 overflow-y-auto z-100">
      <div class="flex items-center justify-center min-h-screen">
        <DialogOverlay class="fixed inset-0 bg-black opacity-50" />
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div class="relative max-w-3xl mx-auto bg-white rounded-md px-md py-base overflow-y-auto modal--inner">
            <DialogTitle><slot name="title" /></DialogTitle>
            <DialogDescription v-if="$slots.description"><slot name="description" /></DialogDescription>
            <slot />
            <button class="absolute top-0 right-0" aria-label="Close the modal" @click="emitClose">
              <XIcon class="h-5 w-5 cursor-pointer mt-xs mr-xs" />
            </button>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogOverlay, DialogTitle, DialogDescription, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { XIcon } from '@heroicons/vue/solid';

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close']);
const emitClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal--inner {
  max-height: 95vh;
  max-width: 95vw;
}
</style>