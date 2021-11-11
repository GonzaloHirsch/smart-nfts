<template>
  <div class="bg-gray-50">
    <v-hero :full-height="true" class="bg-brand_primary">
      <h1 class="text-typography_primary mb-md text-center">{{$t('app.name')}}</h1>
      <h2 class="text-typography_primary text-center text-h3" v-html="$t('home.hero.subtitle')"/>
      <div class="flex flex-row items-center justify-center mt-xl text-h5">
        <v-button format="secondary" href="/create" target="_self" aria="Go to create page" :external="false" :white="true" text="CREATE" class="mr-md"/>
        <v-button format="secondary" href="/interact" target="_self" aria="Go to interact page" :external="false" :white="true" text="INTERACT" class="ml-md"/>
      </div>
      <a href="#explained" class="text-typography_primary text-center mt-xl text-body_xl flex flex-row items-center justify-center">
        Learn More
        <QuestionMarkCircleIcon class="h-8 w-8 ml-xs"/>
      </a>
    </v-hero>
    <div class="flex mt-8 lg:flex-shrink-0 lg:mt-0">
        <div class="inline-flex rounded-md shadow">
          <v-button format="primary" href="/about" target="_blank" aria="Go to about page" :external="false" text="Go to About"/>
          <v-button format="secondary" href="/about" target="_blank" aria="Go to about page" :external="true" text="Go to About"/>
          <v-button format="tertiary" text="Go to About"/>
        </div>
      </div>
    <div class="flex mt-8 lg:flex-shrink-0 lg:mt-0 bg-brand_primary">
        <div class="inline-flex rounded-md shadow">
          <v-button format="primary" href="/about" target="_blank" aria="Go to about page" :external="false" :white="true" text="Go to About"/>
          <v-button format="secondary" href="/about" target="_blank" aria="Go to about page" :external="true" :white="true" text="Go to About"/>
          <v-button format="tertiary" :white="true" text="Go to About"/>
        </div>
      </div>
  </div>
</template>

<script setup>
// Components
import vButton from "@/components/button.vue";
import vHero from "@/components/hero.vue";
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid'

import { useMeta } from 'vue-meta'

useMeta({ title: 'Homepage', description: "This is the homepage to our project" })
</script>
