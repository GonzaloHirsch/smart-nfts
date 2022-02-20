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
                    <div class="modal--outer">
                        <div
                            :class="[
                                'relative mx-auto bg-white rounded-md overflow-y-auto modal--inner',
                                !props.noPadding ? 'px-md py-base' : '',
                                props.noScrollbar ? 'modal--hide-scrollbar' : '',
                                props.maxWidth === '3xl' ? 'max-w-3xl' : '',
                                props.maxWidth === '2xl' ? 'max-w-2xl' : '',
                                props.maxWidth === 'xl' ? 'max-w-xl' : '',
                                props.maxWidth === 'lg' ? 'max-w-lg' : '',
                                props.maxWidth === 'md' ? 'max-w-md' : ''
                            ]"
                        >
                            <DialogTitle><slot name="title" /></DialogTitle>
                            <DialogDescription v-if="$slots.description"><slot name="description" /></DialogDescription>
                            <slot />
                            <button
                                :class="['absolute top-0 right-0', props.darkMode ? 'text-white' : '']"
                                :aria-label="$t('modal.aria')"
                                @click="emitClose"
                            >
                                <XIcon class="h-5 w-5 cursor-pointer mt-xs mr-xs" />
                            </button>
                        </div>
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
    },
    noPadding: {
        type: Boolean,
        default: false
    },
    noScrollbar: {
        type: Boolean,
        default: false
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    maxWidth: {
        type: String,
        default: '2xl'
    }
});
const emit = defineEmits(['close']);
const emitClose = () => {
    emit('close');
};
</script>

<style scoped>
.modal--inner {
    max-height: 90vh;
}

.modal--outer {
  max-width: 95vw;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.modal--hide-scrollbar::-webkit-scrollbar {
    @apply hidden;
}

/* Hide scrollbar for IE, Edge and Firefox */
.modal--hide-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
