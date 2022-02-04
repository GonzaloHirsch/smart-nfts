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
            href="#explained"
            class="text-brand_secondary text-center mt-sm text-body_xl flex flex-row items-center justify-center"
            aria-label="Learn more about the possible options you have"
        >
            Learn More
            <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
        </a>
    </v-left-hero>

    <v-section id="features" class="bg-typography_primary">
        <h2 class="mb-base text-brand_secondary">{{$t('home.tabs.title')}}</h2>
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
                            format="secondary"
                            href="/create"
                            target="_self"
                            aria="Go to interact page"
                            :external="false"
                            :white="false"
                            text="Go Create"
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
                        <v-contract-id-verificator :button="{ text: 'home.tabs.buttons.edit', format: 'secondary' }" @validId="handleValidEditId" />
                    </template>
                    <template #image>
                        <v-edit-drawing />
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
                            :button="{ text: 'home.tabs.buttons.interact', format: 'secondary' }"
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

    <v-section class="bg-light">
        <h2 class="text-center text-brand_primary mb-base">About the project</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi
            corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.
        </p>
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

import { useMeta } from 'vue-meta';

import vCreateDrawing from '@/assets/images/Create-Drawing.svg?component';
import vEditDrawing from '@/assets/images/Edit-Drawing.svg?component';
import vInteractDrawing from '@/assets/images/Interact-Drawing.svg?component';
import vContractIdVerificator from '@/components/contractIdVerificator.vue';

import { useRouter } from 'vue-router';
const router = useRouter();

const handleValidEditId = (id) => {
    router.push(`/create/${id}`);
};

const handleValidInteractId = (id) => {
    router.push(`/interact/${id}`);
};

useMeta({
    title: 'Homepage',
    description: 'This is the homepage to our project'
});
</script>
