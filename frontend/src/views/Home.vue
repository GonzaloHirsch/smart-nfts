<template>
  <v-hero :full-height="true" class="bg-custom_gradient_1 bg-cover" title="app.name" subtitle="home.hero.subtitle">
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
    <a href="#explained" class="text-typography_primary text-center mt-xl text-body_xl flex flex-row items-center justify-center" aria-label="Learn more about the possible options you have">
      Learn More
      <QuestionMarkCircleIcon class="h-8 w-8 ml-xs" />
    </a>
  </v-hero>

  <v-section id="explained" class="bg-typography_primary">
    <div class="divide-x-2 divide-brand_secondary flex flex-row">
      <div class="text-left pr-md">
        <h2 class="text-brand_primary mb-sm">Create</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione velit sapiente, maxime placeat quas adipisci cupiditate rerum. Neque, illum consequatur? Voluptatem architecto blanditiis debitis animi voluptatum, nesciunt cumque ullam? Reiciendis?</p>
        <v-button class="mt-base" format="primary" href="/create" target="_self" aria="Go to the create page" :external="false" :white="false" text="GO CREATE" />
      </div>
      <div class="text-right pl-md">
        <h2 class="text-brand_primary mb-sm">Interact</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione velit sapiente, maxime placeat quas adipisci cupiditate rerum. Neque, illum consequatur? Voluptatem architecto blanditiis debitis animi voluptatum, nesciunt cumque ullam? Reiciendis?</p>
        <v-button class="mt-base" format="primary" href="/interact" target="_self" aria="Go to the interact page" :external="false" :white="false" text="GO INTERACT" />
      </div>
    </div>
  </v-section>

  <v-section class="bg-light">
    <h2 class="text-center text-brand_primary mb-base">About the project</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque ea iste sunt non delectus incidunt minima esse neque cupiditate, modi corporis dignissimos necessitatibus? Quos cum architecto facere dolorum suscipit.</p>
  </v-section>
</template>

<script setup>
// Components
import vButton from '@/components/button.vue';
import vHero from '@/components/hero.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { useMeta } from 'vue-meta';

useMeta({
  title: 'Homepage',
  description: 'This is the homepage to our project'
});
</script>
