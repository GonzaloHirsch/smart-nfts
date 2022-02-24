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
            <div class="grid grid-cols-10 gap-sm mt-base">
                <div class="col-span-full lg:col-span-6 md:row-span-2 status--box">
                    <h2 class="status--box-title">{{ $t('status.status.wallet.title') }}</h2>

                    <h3 class="status--box-subtitle">{{ $t('status.status.wallet.address.title') }}</h3>
                    <v-tooltip v-if="isOk" :text="$t('status.status.wallet.address.copy')" class="md:ml-base">
                        <h4
                            @click="copyWalletAddress"
                            class="status--box-value break-all text-left w-full hover:text-brand_secondary duration-200 hover:cursor-pointer"
                        >
                            {{ status?.wallet?.address }}
                        </h4>
                    </v-tooltip>
                    <h4 v-else class="status--box-value break-all text-left w-full text-error md:ml-base">{{ $t('status.errors.noAddress') }}</h4>

                    <h3 class="status--box-subtitle">{{ $t('status.status.wallet.balance.title') }}</h3>
                    <div class="flex items-center justify-start md:ml-base">
                        <h4 v-if="isOk" class="status--box-value">{{ status?.wallet?.balance?.toFixed(8) }} ETH</h4>
                        <h4 v-else class="text-error status--box-value">{{ $t('status.errors.noBalance') }}</h4>
                        <v-tooltip :text="$t('status.status.wallet.balance.lowBalance')" class="ml-xs"
                            ><ExclamationCircleIcon v-if="hasLowBalance" class="w-6 h-6 text-error"
                        /></v-tooltip>
                    </div>
                </div>
                <div class="col-span-full md:col-span-5 lg:col-span-4 row-span-1 status--box">
                    <h3 class="status--box-title">{{ $t('status.status.wallet.network.using') }}</h3>
                    <div class="mt-sm">
                        <a
                            v-if="isOk"
                            class="status--box-value hover:text-brand_secondary duration-300"
                            :href="`https://${status?.wallet?.network}.etherscan.io/`"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ capitalize(status?.wallet?.network) }} Testnet</a
                        >
                        <span v-else class="text-error status--box-value">{{ $t('status.errors.noNetwork') }}</span>
                    </div>
                </div>
                <div class="col-span-full md:col-span-5 lg:col-span-4 status--box">
                    <h3 class="status--box-title">{{ $t('status.status.timestamp') }}</h3>
                    <h4 class="status--box-value mt-sm">{{ $d(status?.timestamp || new Date(), 'long') }}</h4>
                </div>
                <div v-if="!isLoading && isOk" class="col-span-full status--box">
                    <h3 class="status--box-title">{{$t('status.contribute.title')}}</h3>
                    <div class="mt-sm status--box-value"><span class="status--box-value" v-html="$t('status.contribute.addBalance')"></span><sup>*</sup></div>
                    <p class="text-sm mt-sm"><sup>*</sup>{{ $t('status.contribute.disclaimer') }}</p>
                </div>
            </div>
        </template>
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

.status--box-subtitle {
    @apply mt-sm mb-xs text-h4;
}

.status--box-title {
    @apply text-brand_secondary leading-none;
}

.status--box-value {
    @apply text-h5 !important;
}

.status--box {
    @apply p-base bg-brand_primary border border-brand_tertiary shadow-md shadow-brand_primary rounded-md;
}
</style>
