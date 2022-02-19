<template>
    <v-modal :showModal="props.showModal" @close="emitClose">
        <template #title>
            <h3 class="text-brand_secondary">{{ $t('editor.verify.title') }}</h3>
        </template>
        <template v-if="props.isLoadingModal">
            <div class="w-full rounded-lg text-brand_secondary">
                <h4 class="flex items-center justify-center my-base py-xl">
                    {{ $t('editor.verify.loading') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
            </div>
        </template>
        <template v-else>
            <p v-if="!props.modalError" class="break-words" v-html="$t('editor.verify.message')"></p>
            <p v-else class="break-words" v-html="$t('editor.verify.error')"></p>
        </template>
    </v-modal>
</template>

<script setup>
import vModal from '@/components/modal.vue';
import { RefreshIcon } from '@heroicons/vue/solid';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    isLoadingModal: {
        type: Boolean,
        default: false
    },
    modalError: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['close']);
const emitClose = () => {
    emit('close');
};
</script>
