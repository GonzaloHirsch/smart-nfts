<template>
    <v-left-hero :full-height="true" class="bg-gradient-to-b from-brand_primary to-white" title="about.hero.title" subtitle="about.hero.subtitle">
        <template #buttons>
            <v-button
                format="secondary"
                href="#erc-721"
                target="_self"
                :aria="$t('about.hero.button.aria')"
                :external="false"
                :white="false"
                :text="$t('about.hero.button.text')"
                size="large"
            />
        </template>
        <a
            href="/status"
            class="text-brand_secondary text-center mt-sm text-lg md:text-body_xl flex flex-row items-center justify-center"
            :aria-label="$t('about.hero.status.aria')"
        >
            {{ $t('about.hero.status.text') }}
            <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
        </a>
    </v-left-hero>

    <v-section id="erc-721" class="bg-typography_primary">
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
        <h2 class="mb-xs md:mb-base text-brand_secondary text-center">{{ $t('about.technologies.title') }}</h2>
        <v-facts :facts="technologies" />
    </v-section>

    <v-section id="how-it-works" class="bg-gradient-to-t from-brand_primary to-white">
        <h2 class="mb-base text-brand_secondary text-center">{{ $t('about.howItWorks.title') }}</h2>
        <v-diagram-drawing class="howitworks--diagram" />
        <div class="howitworks--table">
            <template v-for="(step, index) in process" :key="index">
                <div class="howitworks--table--cell">
                    <div class="howitworks--table--cell-title">
                        {{ step.title }}
                    </div>
                    <div class="howitworks--table--cell-content">
                        {{ step.description }}
                    </div>
                </div>
            </template>
        </div>
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vFacts from '@/components/facts.vue';
import vLeftHero from '@/components/leftHero.vue';
import vSection from '@/components/section.vue';
import vFeatureContent from '@/components/featureContent.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { useMeta } from 'vue-meta';

// Images
import vFungibleDrawing from '@/assets/images/Fungible-Drawing.vue';
import vDiagramDrawing from '@/assets/images/Diagram-Drawing.vue';
import vIconOpenzeppelin from '@/assets/images/icons/Icon-Openzeppelin.vue';
import vIconPinata from '@/assets/images/icons/Icon-Pinata.vue';
import vIconInfura from '@/assets/images/icons/Icon-Infura.vue';

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

const process = [
    {
        title: 'A',
        description: t('about.howItWorks.process.A.description')
    },
    {
        title: 'B',
        description: t('about.howItWorks.process.B.description')
    },
    {
        title: 'C',
        description: t('about.howItWorks.process.C.description')
    }
];

useMeta({
    title: t('about.meta.title'),
    description: t('about.meta.description')
});
</script>

<style scoped>
.howitworks--diagram {
    @apply mx-auto;
    max-width: 1000px;
}

.howitworks--table {
    @apply grid grid-cols-9 mt-base mx-auto;
    max-width: 1000px;
}

.howitworks--table--cell {
    @apply col-span-full md:col-span-3 text-center row-span-1 h-full flex flex-col;
}

.howitworks--table--cell-content {
    @apply bg-brand_primary p-sm text-lg h-full flex flex-col items-center justify-center;
}

.howitworks--table--cell-title {
    @apply bg-brand_secondary text-white py-xs font-bold text-h5 h-fit;
}

@screen md {
    .howitworks--table--cell:first-of-type .howitworks--table--cell-content {
        @apply border-r border-brand_secondary;
    }
    
    .howitworks--table--cell:last-of-type .howitworks--table--cell-content {
        @apply border-l border-brand_secondary;
    }
    
    .howitworks--table--cell:not(:first-of-type):not(:last-of-type) .howitworks--table--cell-content {
        @apply border-r border-l border-brand_secondary;
    }
}
</style>
