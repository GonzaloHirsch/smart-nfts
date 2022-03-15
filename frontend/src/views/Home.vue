<template>
    <v-left-hero :full-height="true" class="bg-gradient-to-b from-brand_primary to-white" title="home.hero.title" :is-home="true">
        <template #buttons>
            <v-button
                format="secondary"
                href="/#features"
                target="_self"
                :aria="$t('home.hero.button.aria')"
                :external="false"
                :white="false"
                :text="$t('home.hero.button.text')"
                size="large"
            />
        </template>
        <a
            href="#benefits"
            class="text-brand_secondary text-center mt-sm text-lg md:text-body_xl flex flex-row items-center justify-center"
            :aria-label="$t('home.hero.learnMore.aria')"
        >
            {{ $t('home.hero.learnMore.text') }}
            <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
        </a>
    </v-left-hero>

    <v-section id="features" class="bg-typography_primary">
        <h2 class="mb-base text-brand_secondary">{{ $t('home.tabs.title') }}</h2>
        <v-tabs :tabs="['Create', 'Edit', 'Interact', 'View']" :tabTitles="[$t('home.tabs.content.create.title'), $t('home.tabs.content.edit.title'), $t('home.tabs.content.interact.title'), $t('home.tabs.content.view.title')]">
            <template #Create>
                <v-feature-content>
                    <template #content>
                        <p>
                            {{ $t('home.tabs.content.create.text') }}
                        </p>
                    </template>
                    <template #bottom>
                        <v-button
                            :format="isLoading ? 'disabled' : 'secondary'"
                            @click="isLoading ? undefined : handleCreateContract()"
                            :aria="$t('home.tabs.buttons.create.aria')"
                            :external="false"
                            :white="false"
                            :loading="isLoading"
                            :disabled="isLoading"
                            :text="$t('home.tabs.buttons.create.text')"
                            size="medium"
                        />
                    </template>
                    <template #image>
                        <v-create-drawing />
                    </template>
                </v-feature-content>
            </template>
            <template #Edit>
                <v-feature-content>
                    <template #content>
                        <p>
                            {{ $t('home.tabs.content.edit.text') }}
                        </p>
                    </template>
                    <template #bottom>
                        <v-contract-id-verificator
                            :button="{
                                text: 'home.tabs.buttons.edit.text',
                                aria: 'home.tabs.buttons.edit.aria',
                                format: 'secondary',
                                size: 'medium'
                            }"
                            @validId="handleValidEditId"
                        />
                    </template>
                    <template #image>
                        <v-edit-drawing class="fact-image--smaller" />
                    </template>
                </v-feature-content>
            </template>
            <template #Interact>
                <v-feature-content>
                    <template #content>
                        <p>
                            {{ $t('home.tabs.content.interact.text') }}
                        </p>
                    </template>
                    <template #bottom>
                        <v-contract-id-verificator
                            :button="{
                                text: 'home.tabs.buttons.interact.text',
                                aria: 'home.tabs.buttons.interact.aria',
                                format: 'secondary',
                                size: 'medium'
                            }"
                            @validId="handleValidInteractId"
                        />
                    </template>
                    <template #image>
                        <v-interact-drawing />
                    </template>
                </v-feature-content>
            </template>
            <template #View>
                <v-feature-content>
                    <template #content>
                        <p>
                            {{ $t('home.tabs.content.view.text') }}
                        </p>
                    </template>
                    <template #bottom>
                        <v-contract-id-verificator
                            :button="{
                                text: 'home.tabs.buttons.view.text',
                                aria: 'home.tabs.buttons.view.aria',
                                format: 'secondary',
                                size: 'medium'
                            }"
                            @validId="handleValidViewId"
                        />
                    </template>
                    <template #image>
                        <v-view-drawing />
                    </template>
                </v-feature-content>
            </template>
        </v-tabs>
    </v-section>

    <v-section id="benefits" class="bg-typography_primary">
        <v-facts :facts="facts" />
    </v-section>

    <v-section id="offer" class="bg-white">
        <div class="flex flex-col md:flex-row w-full">
            <div class="w-full md:w-6/12">
                <v-vertical-facts :facts="verticalFacts" />
            </div>
            <div class="w-full md:w-6/12">
                <v-contract-drawing class="contract-drawing h-full mx-auto" />
            </div>
        </div>
    </v-section>

    <v-section id="about" class="bg-gradient-to-b from-white via-white to-brand_primary">
        <div class="flex flex-col justify-center items-center bg-brand_primary border-2 rounded-md border-brand_secondary shadow-md shadow-brand_tertiary p-sm md:p-base w-full md:w-fit mx-auto">
            <h2 class="text-h5 md:text-h4 leading-none mb-sm text-center md:text-left">{{ $t('home.cta.title') }}</h2>
            <p class="mb-sm text-center md:text-left">{{ $t('home.cta.text') }}</p>
            <div class="flex flex-col sm:flex-row">
                <v-button
                    format="secondary"
                    href="/about#erc-721"
                    target="_self"
                    :aria="$t('home.cta.buttons.erc721.aria')"
                    :external="false"
                    :white="false"
                    :text="$t('home.cta.buttons.erc721.text')"
                    size="medium"
                    class="w-fit mx-auto sm:mx-0"
                />
                <v-button
                    format="secondary"
                    href="/about#technologies"
                    target="_self"
                    :aria="$t('home.cta.buttons.technologies.aria')"
                    :external="false"
                    :white="false"
                    :text="$t('home.cta.buttons.technologies.text')"
                    size="medium"
                    class="w-fit mt-sm mx-auto sm:mt-0 sm:mr-0 sm:ml-sm"
                />
                <v-button
                    format="secondary"
                    href="/about#how-it-works"
                    target="_self"
                    :aria="$t('home.cta.buttons.howItWorks.aria')"
                    :external="false"
                    :white="false"
                    :text="$t('home.cta.buttons.howItWorks.text')"
                    size="medium"
                    class="w-fit mt-sm mx-auto sm:mt-0 sm:mr-0 sm:ml-sm"
                />
                <v-button
                    format="secondary"
                    href="/status/"
                    target="_self"
                    :aria="$t('home.cta.buttons.status.aria')"
                    :external="false"
                    :white="false"
                    :text="$t('home.cta.buttons.status.text')"
                    size="medium"
                    class="w-fit mt-sm mx-auto sm:mt-0 sm:mr-0 sm:ml-sm"
                />
            </div>
        </div>
    </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vLeftHero from '@/components/leftHero.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import vTabs from '@/components/tabs.vue';
import vFeatureContent from '@/components/featureContent.vue';
import vContractIdVerificator from '@/components/contractIdVerificator.vue';
import vFacts from '@/components/facts.vue';
import vVerticalFacts from '@/components/verticalFacts.vue';

import { useMeta } from 'vue-meta';
import { ref } from 'vue';

// Images
import vCreateDrawing from '@/assets/images/Create-Drawing.svg?component';
import vEditDrawing from '@/assets/images/Edit-Drawing.svg?component';
import vInteractDrawing from '@/assets/images/Interact-Drawing.svg?component';
import vViewDrawing from '@/assets/images/View-Drawing.svg?component';
import vContractDrawing from '@/assets/images/Contract-Drawing.svg?component';
import vIconNoWallet from '@/assets/images/icons/Icon-No-Wallet.svg?component';
import vIconNoGas from '@/assets/images/icons/Icon-No-Gas.svg?component';
import vIconNoCoding from '@/assets/images/icons/Icon-No-Coding.svg?component';
import vIconExplanation from '@/assets/images/icons/Icon-Explanation.svg?component';
import vIconTime from '@/assets/images/icons/Icon-Time.svg?component';
import vIconCentralized from '@/assets/images/icons/Icon-Centralized.svg?component';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useApi } from '@/plugins/api';
const api = useApi();

import { useRecaptcha } from '@/plugins/recaptcha';
const recaptcha = useRecaptcha();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const handleValidEditId = (id) => {
    router.push(`/create/${id}`);
};

const handleValidInteractId = (id) => {
    router.push(`/interact/${id}`);
};

const handleValidViewId = (id) => {
    router.push(`/tokens/${id}`);
};

const isLoading = ref(false);
const handleCreateContract = () => {
    isLoading.value = true;
    recaptcha.challengeInput('CREATE_CONTRACT', (token) => {
        // Call API & wait for the response
        api.createContract(token)
            .then((res) => {
                // Don't make it stop loading if it's ok, it's better for the experience
                // isLoading.value = false;
                if (res.data && res.data.id) {
                    router.push(`/create/${res.data.id}`);
                } else {
                    isLoading.value = false;
                }
            })
            .catch((err) => {
                console.error(err);
                isLoading.value = false;
                if (err?.response?.status === 403) {
                    setSnackbar(t('errors.robot'), 'error', 2.5);
                } else {
                    setSnackbar(t('errors.internal'), 'error', 2.5);
                }
            });
    });
};

const facts = [
    {
        title: t('home.facts.wallet.title'),
        description: t('home.facts.wallet.description'),
        icon: vIconNoWallet
    },
    {
        title: t('home.facts.gas.title'),
        description: t('home.facts.gas.description'),
        icon: vIconNoGas
    },
    {
        title: t('home.facts.coding.title'),
        description: t('home.facts.coding.description'),
        icon: vIconNoCoding
    }
];

const verticalFacts = [
    {
        title: t('home.verticalFacts.step.title'),
        description: t('home.verticalFacts.step.description'),
        icon: vIconExplanation
    },
    {
        title: t('home.verticalFacts.simple.title'),
        description: t('home.verticalFacts.simple.description'),
        icon: vIconTime
    },
    {
        title: t('home.verticalFacts.centralized.title'),
        description: t('home.verticalFacts.centralized.description'),
        icon: vIconCentralized
    }
];

useMeta({
    title: t('home.meta.title'),
    description: t('home.meta.description')
});
</script>
