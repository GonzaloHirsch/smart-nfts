<template>
    <v-left-hero :full-height="true" class="bg-gradient-to-b from-brand_primary to-white" title="home.hero.title">
        <template #buttons>
            <v-button
                format="secondary"
                href="/#features"
                target="_self"
                aria="Go to create page"
                :external="false"
                :white="false"
                :text="$t('home.hero.buttonStart')"
            />
        </template>
        <a
            href="#benefits"
            class="text-brand_secondary text-center mt-sm text-lg md:text-body_xl flex flex-row items-center justify-center"
            aria-label="Learn more about the possible options you have"
        >
            Learn More
            <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
        </a>
    </v-left-hero>

    <v-section id="features" class="bg-typography_primary">
        <h2 class="mb-base text-brand_secondary">{{ $t('home.tabs.title') }}</h2>
        <v-tabs :tabs="['Create', 'Edit', 'Interact']">
            <template #Create>
                <v-feature-content>
                    <template #content>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque
                            cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit. Lorem ipsum dolor sit
                            amet, consectetur adipisicing elit. Impedit dicta dolorum perferendis cum quia ducimus? Quas cumque provident aliquam! Hic
                            accusantium numquam assumenda sequi mollitia dicta, at iusto obcaecati doloremque.
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
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque
                            cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit. Lorem ipsum dolor sit
                            amet, consectetur adipisicing elit. Impedit dicta dolorum perferendis cum quia ducimus? Quas cumque provident aliquam! Hic
                            accusantium numquam assumenda sequi mollitia dicta, at iusto obcaecati doloremque.
                        </p>
                    </template>
                    <template #bottom>
                        <v-contract-id-verificator
                            :button="{ text: 'home.tabs.buttons.edit.text', aria: 'home.tabs.buttons.edit.aria', format: 'secondary' }"
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
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque
                            cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit. Lorem ipsum dolor sit
                            amet, consectetur adipisicing elit. Impedit dicta dolorum perferendis cum quia ducimus? Quas cumque provident aliquam! Hic
                            accusantium numquam assumenda sequi mollitia dicta, at iusto obcaecati doloremque.
                        </p>
                    </template>
                    <template #bottom>
                        <v-contract-id-verificator
                            :button="{ text: 'home.tabs.buttons.interact.text', aria: 'home.tabs.buttons.interact.aria', format: 'secondary' }"
                            @validId="handleValidInteractId"
                        />
                    </template>
                    <template #image>
                        <v-interact-drawing />
                    </template>
                </v-feature-content>
            </template>
        </v-tabs>
    </v-section>

    <v-section id="benefits" class="bg-typography_primary">
        <v-facts :facts="facts" />
    </v-section>

    <v-section id="offer" class="bg-gradient-to-b from-white to-brand_primary">
        <div class="flex flex-col md:flex-row w-full">
            <div class="w-full md:w-6/12">
                <v-vertical-facts :facts="verticalFacts" />
            </div>
            <div class="w-full md:w-6/12">
                <v-contract-drawing class="contract-drawing h-full mx-auto" />
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
import vHiddenAnchor from '@/components/hiddenAnchor.vue';
import vContractIdVerificator from '@/components/contractIdVerificator.vue';
import vFacts from '@/components/facts.vue';
import vVerticalFacts from '@/components/verticalFacts.vue';

import { useMeta } from 'vue-meta';
import { ref } from 'vue';

// Images
import vCreateDrawing from '@/assets/images/Create-Drawing.svg?component';
import vEditDrawing from '@/assets/images/Edit-Drawing.svg?component';
import vInteractDrawing from '@/assets/images/Interact-Drawing.svg?component';
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

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const handleValidEditId = (id) => {
    router.push(`/create/${id}`);
};

const handleValidInteractId = (id) => {
    router.push(`/interact/${id}`);
};

const isLoading = ref(false);
const handleCreateContract = () => {
    isLoading.value = true;
    // Call API & wait for the response
    api.createContract().then((res) => {
        // Don't make it stop loading if it's ok, it's better for the experience
        // isLoading.value = false;
        if (res.data && res.data.id) {
            router.push(`/create/${res.data.id}`);
        } else {
            isLoading.value = false;
        }
    });
};

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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
    title: 'Homepage',
    description: 'This is the homepage to our project'
});
</script>
