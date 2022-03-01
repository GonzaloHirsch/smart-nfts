<template>
    <v-left-hero :full-height="true" class="bg-gradient-to-b from-brand_primary to-white" title="about.hero.title" subtitle="about.hero.subtitle">
        <template #buttons>
            <v-button
                format="secondary"
                href="#how-it-works"
                target="_self"
                :aria="$t('about.hero.button.aria')"
                :external="false"
                :white="false"
                :text="$t('about.hero.button.text')"
                size="large"
            />
        </template>
    </v-left-hero>

    <v-section id="how-it-works" class="bg-typography_primary">
        <v-feature-content>
            <template #title>
                <h2 class="mb-base text-brand_secondary">{{ $t('about.erc721.title') }}</h2>
            </template>
            <template #content>
                <p>
                    {{ $t('about.erc721.text') }}
                </p>
            </template>
            <template #image>
                <v-fungible-drawing />
            </template>
        </v-feature-content>
    </v-section>
    
    <v-section id="technologies" class="bg-typography_primary">
        <h2 class="mb-base text-brand_secondary text-center">{{ $t('about.technologies.title') }}</h2>
        <v-facts :facts="technologies" />
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vFacts from '@/components/facts.vue';
import vLeftHero from '@/components/leftHero.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import vFeatureContent from '@/components/featureContent.vue';
import vHiddenAnchor from '@/components/hiddenAnchor.vue';

import { useMeta } from 'vue-meta';

// Images
import vFungibleDrawing from '@/assets/images/Fungible-Drawing.svg?component';
import vIconOpenzeppelin from '@/assets/images/icons/Icon-Openzeppelin.svg?component';
import vIconPinata from '@/assets/images/icons/Icon-Pinata.svg?component';
import vIconInfura from '@/assets/images/icons/Icon-Infura.svg?component';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const technologies = [
    {
        title: t('about.technologies.facts.openzeppelin.title'),
        description: t('about.technologies.facts.openzeppelin.description'),
        icon: vIconOpenzeppelin
    },
    {
        title: t('about.technologies.facts.pinata.title'),
        description: t('about.technologies.facts.pinata.description'),
        icon: vIconPinata
    },
    {
        title: t('about.technologies.facts.infura.title'),
        description: t('about.technologies.facts.infura.description'),
        icon: vIconInfura
    }
];

useMeta({
    title: t('about.meta.title'),
    description: t('about.meta.description')
});
</script>
