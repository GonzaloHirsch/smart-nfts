<template>
    <v-hero :full-height="true" :darkMode="false" class="bg-brand_tertiary" title="500.hero.title" subtitle="500.hero.subtitle">
        <template #buttons>
            <v-button
                format="secondary"
                @click="handleGoStatus"
                :aria="$t('500.hero.buttonStatus.aria')"
                :white="false"
                :text="$t('500.hero.buttonStatus.text').toUpperCase()"
                class="mr-sm"
            />
            <v-button
                format="secondary"
                @click="handleGoHome"
                :aria="$t('500.hero.buttonHome.aria')"
                :white="false"
                :text="$t('500.hero.buttonHome.text').toUpperCase()"
            />
        </template>
    </v-hero>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';
import { useMeta } from 'vue-meta';

import { useRouter } from 'vue-router';
const router = useRouter();
const handleGoHome = () => {
    router.replace('/');
};
const handleGoStatus = () => {
    router.replace('/status');
};

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

useMeta({ title: t('500.meta.title'), description: t('500.meta.description') });
</script>
