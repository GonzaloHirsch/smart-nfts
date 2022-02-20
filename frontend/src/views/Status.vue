<template>
    <v-section id="features" class="bg-typography_primary">
        <div class="flex w-full items-center justify-center text-center">
            <h1 class="text-brand_secondary status--title">{{ $t('status.title') }}</h1>
            <h1 v-if="!isLoading" class="text-brand_secondary status--title">{{ ' - ' }}</h1>
            <h1 v-if="!isLoading" :class="[isOk ? 'text-green-500' : 'text-error', 'status--title']">
                {{ isOk ? $t('status.status.ok') : $t('status.status.notOk') }}
            </h1>
        </div>
        <template v-if="isLoading">
            <div class="flex flex-row items-center justify-center p-xs md:p-md">
                <div class="bg-brand_secondary w-full rounded-lg text-typography_primary">
                    <h4 class="flex items-center justify-center my-base py-xl">
                        {{ $t('status.prepare') }} <RefreshIcon class="h-10 w-10 animate-spin-reverse transform rotate-180" />
                    </h4>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex flex-col items-center justify-center mt-sm">
                <h2 class="mb-xs">{{ $t('status.status.wallet.address.title') }}</h2>
                <v-tooltip v-if="isOk" :text="$t('status.status.wallet.address.copy')">
                    <h3
                        @click="copyWalletAddress"
                        class="text-h4 break-all text-center w-full hover:text-brand_secondary duration-200 hover:cursor-pointer"
                    >
                        {{ status?.wallet?.address }}
                    </h3>
                </v-tooltip>
                <h3 v-else class="text-h4 break-all text-center w-full text-error">{{$t('status.errors.noWallet')}}</h3>
                <h2 class="mt-sm mb-xs">{{ $t('status.status.wallet.balance.title') }}</h2>
                <div class="flex items-center justify-center">
                    <h3 v-if="isOk">{{ status?.wallet?.balance?.toFixed(8) }} eth</h3>
                    <h3 v-else class="text-error text-h4">{{$t('status.errors.noBalance')}}</h3>
                    <v-tooltip :text="$t('status.status.wallet.balance.lowBalance')" class="ml-xs"
                        ><ExclamationCircleIcon v-if="hasLowBalance" class="w-8 h-8 text-error"
                    /></v-tooltip>
                </div>
                <p class="mt-xs text-lg">
                    {{ $t('status.status.wallet.network.using') }}
                    <a v-if="isOk"
                        class="text-lg underline hover:text-brand_secondary duration-300"
                        :href="`https://${status?.wallet?.network}.etherscan.io/`"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ capitalize(status?.wallet?.network) }} (testnet)</a
                    >
                    <span v-else class="text-error text-lg">{{$t('status.errors.noNetwork')}}</span>
                </p>
                <p class="mt-base text-sm" v-html="$t('status.status.timestamp', [$d(status?.timestamp || new Date(), 'long')])"></p>
            </div>
        </template>
    </v-section>

    <v-section v-if="!isLoading && isOk">
        <div
            class="bg-brand_primary rounded-lg shadow-md shadow-brand_primary p-sm border-2 border-brand_tertiary w-full md:w-10/12 lg:w-8/12 mx-auto"
        >
            <h4 class="text-center text-brand_secondary">Want to contribute?</h4>
            <div class="mt-sm text-center"><span v-html="$t('status.contribute.addBalance')"></span><sup>*</sup></div>
            <p class="text-xs mt-base"><sup>*</sup>{{ $t('status.contribute.disclaimer') }}</p>
        </div>
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vSection from '@/components/section.vue';

import { DocumentDuplicateIcon, RefreshIcon, ExclamationCircleIcon } from '@heroicons/vue/solid';

import { useMeta } from 'vue-meta';
import { ref, computed } from 'vue';
import { capitalize } from '@/js/utils.js';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const isLoading = ref(false);
const isOk = ref(true);
const status = ref({});
const handleGetStatus = () => {
    isLoading.value = true;
    api.getStatus()
        .then((res) => {
            status.value = res.data;
            isOk.value = true;
            isLoading.value = false;
        })
        .catch((err) => {
            console.error(err);
            isOk.value = false;
            isLoading.value = false;
        });
};
handleGetStatus();

const hasLowBalance = computed(() => status?.value?.wallet?.balance < 1);

const copyWalletAddress = () => {
    if (!navigator.clipboard) {
        setSnackbar(t('status.errors.copyAddress'), 'error', 5);
        return;
    }
    navigator.clipboard
        .writeText(status.value.wallet.address)
        .then(() => {
            setSnackbar(t('status.status.wallet.address.copyOk'), 'default', 5);
        })
        .catch((err) => {
            console.error(err);
            setSnackbar(t('status.errors.copyAddress'), 'error', 5);
        });
};

useMeta({
    title: t('status.meta.title'),
    description: t('status.meta.description')
});
</script>

<style scoped>
.status--title {
    @apply contents;
}
</style>
