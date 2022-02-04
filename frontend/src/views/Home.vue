<template>
    <v-hero :full-height="true" class="bg-gradient-to-tl from-brand_secondary to-brand_primary" title="app.name" subtitle="home.hero.subtitle">
        <template #buttons>
            <v-button
                format="secondary"
                href="/create"
                target="_self"
                aria="Go to create page"
                :external="false"
                :white="true"
                text="CREATE"
                class="mr-sm md:mr-md lg:mr-xl"
            />
            <v-button format="secondary" href="/interact" target="_self" aria="Go to interact page" :external="false" :white="true" text="INTERACT" />
        </template>
        <a
            href="#explained"
            class="text-typography_primary text-center mt-xl text-body_xl flex flex-row items-center justify-center"
            aria-label="Learn more about the possible options you have"
        >
            Learn More
            <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
        </a>
    </v-hero>

    <v-section id="explained" class="bg-typography_primary">
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
                            class="mt-sm"
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
                        <v-create-drawing/>
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
                        <v-button
                            class="mt-sm"
                            format="secondary"
                            href="/create"
                            target="_self"
                            aria="Go to interact page"
                            :external="false"
                            :white="false"
                            text="Go Edit"
                        />
                    </template>
                    <template #image>
                        <v-edit-drawing/>
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
                        <v-button
                            class="mt-sm"
                            format="secondary"
                            href="/create"
                            target="_self"
                            aria="Go to interact page"
                            :external="false"
                            :white="false"
                            text="Go Interact"
                        />
                    </template>
                    <template #image>
                        <v-interact-drawing/>
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
import vHero from '@/components/hero.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';
import vTabs from '@/components/tabs.vue';
import vFeatureContent from '@/components/featureContent.vue';

import { useMeta } from 'vue-meta';

import vCreateDrawing from '@/assets/images/Create-Drawing.svg?component'
import vEditDrawing from '@/assets/images/Edit-Drawing.svg?component'
import vInteractDrawing from '@/assets/images/Interact-Drawing.svg?component'

useMeta({
    title: 'Homepage',
    description: 'This is the homepage to our project'
});
</script>
