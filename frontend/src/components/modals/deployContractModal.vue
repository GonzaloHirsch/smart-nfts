<template>
    <v-modal :showModal="showModal" @close="emitClose">
        <template #title>
            <h3 class="text-brand_secondary">{{ $t('editor.deploy.title') }}</h3>
        </template>
        <template v-if="!modalError && step && (isLoadingCompile || isLoadingDeploy)">
            <div class="w-full rounded-lg text-brand_secondary py-md md:py-xl">
                <h4 class="text-lg md:text-h4 items-center justify-between mt-base mb-base flex">
                    {{ $t(isLoadingCompile ? 'editor.deploy.loading.compile' : 'editor.deploy.prepare.compile') }}
                    <RefreshIcon v-if="step === 'compile' && isLoadingCompile" class="w-8 h-8 md:h-10 md:w-10 animate-spin-reverse transform rotate-180 ml-md md:ml-xl inline" />
                    <CheckIcon v-else class="w-8 h-8 md:h-10 md:w-10 ml-md md:ml-xl inline" />
                </h4>
                <h4 class="text-lg md:text-h4 items-center justify-between flex">
                    {{ $t(isLoadingDeploy ? 'editor.deploy.loading.deploy' : 'editor.deploy.prepare.deploy') }}
                    <RefreshIcon v-if="step === 'deploy' && isLoadingDeploy" class="w-8 h-8 md:h-10 md:w-10 animate-spin-reverse transform rotate-180 ml-md md:ml-xl inline" />
                    <ClockIcon v-else-if="step !== 'deploy' && !isLoadingDeploy" class="w-8 h-8 md:h-10 md:w-10 ml-md md:ml-xl inline" />
                    <CheckIcon v-else class="w-8 h-8 md:h-10 md:w-10 ml-md md:ml-xl inline" />
                </h4>
            </div>
        </template>
        <template v-else>
            <p v-if="!modalError" class="break-words" v-html="$t('editor.deploy.message', [deployedAddress])"></p>
            <p v-else class="break-words" v-html="$t('editor.deploy.error')"></p>
        </template>
    </v-modal>
</template>

<script setup>
import vModal from '@/components/modal.vue';
import { RefreshIcon, CheckIcon, ClockIcon } from '@heroicons/vue/solid';

defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    isLoadingCompile: {
        type: Boolean,
        default: false
    },
    isLoadingDeploy: {
        type: Boolean,
        default: false
    },
    step: {
        type: String
    },
    modalError: {
        type: Boolean,
        default: false
    },
    deployedAddress: {
        type: String,
        default: undefined
    }
});
const emit = defineEmits(['close']);
const emitClose = () => {
    emit('close');
};
</script>
