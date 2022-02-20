<template>
    <v-hero :full-height="true" :darkMode="false" class="bg-brand_tertiary text-black" title="404.hero.title" subtitle="404.hero.subtitle">
        <template #buttons>
            <v-button
                format="secondary"
                @click="handleGoHome"
                :aria="$t('404.hero.button.aria')"
                :white="false"
                :text="$t('404.hero.button.text').toUpperCase()"
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

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

useMeta({ title: t('404.meta.title'), description: t('404.meta.description') });
</script>
