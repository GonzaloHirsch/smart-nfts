<template>
    <v-modal :showModal="props.showModal" @close="emitClose">
        <template #title>
            <h3 class="text-brand_secondary">{{ $t('editor.email.title') }}</h3>
        </template>
        <template v-if="isSendingEmail">
            <div class="w-full rounded-lg text-brand_secondary">
                <h4 class="flex items-center justify-center my-base py-xl">
                    {{ $t('editor.email.loading') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                </h4>
            </div>
        </template>
        <template v-else>
            <template v-if="sentEmailError || (!isSendingEmail && sentEmail)">
                <p v-if="!sentEmailError" class="break-words" v-html="$t('editor.email.message')"></p>
                <p v-else class="break-words" v-html="$t('editor.email.error')"></p>
            </template>
            <template v-else>
                <p class="break-words mb-sm" v-html="$t('editor.email.inputMessage')"></p>
                <form autocomplete="off">
                    <v-input
                        id="email"
                        name="email"
                        format="primary-white"
                        :continuousInput="true"
                        placeholder="example@example.com"
                        :validations="['required', 'email']"
                        label="Recipient of Email"
                        :hideLabel="true"
                        v-model="email"
                        class="w-full"
                        @validInput="handleValidInput"
                        @invalidInput="handleInvalidInput"
                    />
                    <v-button
                        :format="!canSendEmail ? 'disabled' : 'secondary'"
                        aria="Send the reminder email"
                        :external="false"
                        :white="false"
                        size="medium"
                        :loading="isSendingEmail"
                        :disabled="!canSendEmail"
                        :text="$t('editor.email.button').toUpperCase()"
                        class="mt-sm"
                        @click="!canSendEmail ? undefined : sendEmail()"
                    />
                </form>
            </template>
        </template>
    </v-modal>
</template>

<script setup>
import vModal from '@/components/modal.vue';
import vInput from '@/components/editor/input.vue';
import vButton from '@/components/button.vue';
import { RefreshIcon } from '@heroicons/vue/solid';

import { ref, computed } from 'vue';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    contractId: {
        type: String,
        required: true
    }
});
const emit = defineEmits(['close']);

// Input handling
const email = ref(undefined);
const error = ref(undefined);
const handleValidInput = () => {
    error.value = undefined;
};
const handleInvalidInput = (err) => {
    error.value = err;
};

// Sending email
import { useApi } from '@/plugins/api';
const api = useApi();

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const isSendingEmail = ref(false);
const sentEmail = ref(false);
const sentEmailError = ref(undefined);
const canSendEmail = computed(() => error.value === undefined && !isSendingEmail.value && !sentEmail.value && email.value);
const sendEmail = () => {
    if (canSendEmail.value) {
        isSendingEmail.value = true;
        recaptcha.challengeInput("SEND_REMINDER", api, (recaptchaResponse) => {
            if (recaptchaResponse.data.success) {
                api.sendEmailReminder(props.contractId, email.value)
                    .then(() => {
                        isSendingEmail.value = false;
                        sentEmail.value = true;
                        sentEmailError.value = undefined;
                    })
                    .catch((err) => {
                        isSendingEmail.value = false;
                        sentEmail.value = false;
                        sentEmailError.value = err.response.data.message;
                    });
            } else {
                setSnackbar('You are not human, cannot use this!', 'error', 5);
                isSendingEmail.value = false;
            }
        });
    }
};

const emitClose = () => {
    emit('close', sentEmail.value);
};
</script>
