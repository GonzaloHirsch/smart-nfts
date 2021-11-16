<template>
  <v-section :noPadding="true" class="bg-typography_primary">
    <div class="flex flex-row">
      <div class="flex flex-col w-6/12 bg-light rounded-r-2xl pt-sm pb-base px-md">
        <div class="flex flex-row justify-between items-center">
          <h2 class="text-left text-brand_primary">Contract</h2>
          <input type="text" placeholder="contract-address" />
        </div>
        <v-accordion title="Method" format="white" class="interact--method">
          <template #header>
            <PlayIcon class="w-8 h-8 text-brand_tertiary" @click.stop="callMethod"/>
          </template>
          <template #content>
            <p>THIS IS MY CONTENT</p>
          </template>
        </v-accordion>
        <v-accordion title="Method" format="white" class="interact--method">
          <template #content>
            <p>THIS IS MY CONTENT</p>
          </template>
        </v-accordion>
        <v-accordion title="Method" format="white" class="interact--method">
          <template #content>
            <p>THIS IS MY CONTENT</p>
          </template>
        </v-accordion>
        <v-accordion title="Method" format="white" class="interact--method">
          <template #content>
            <p>THIS IS MY CONTENT</p>
          </template>
        </v-accordion>
        <v-accordion title="Method" format="white" class="interact--method">
          <template #content>
            <p>THIS IS MY CONTENT</p>
          </template>
        </v-accordion>
      </div>
      <div class="flex flex-col items-center justify-center w-6/12">RESULT</div>
    </div>
  </v-section>

  <v-section class="bg-typography_primary">
    <h2 class="text-center text-brand_primary mb-base">Methods Explained</h2>
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
import vSection from '@/components/section.vue';
import vAccordion from '@/components/accordion.vue';
import { PlayIcon } from '@heroicons/vue/solid';

import { useRoute } from 'vue-router';
const route = useRoute();

const callMethod = () => {
  console.log('METHOD EXECUTION')
}

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Contract Editor',
  description: 'This is the homepage to our project'
});
</script>

<style>
.interact--method{
  @apply mt-xs;
}
</style>
