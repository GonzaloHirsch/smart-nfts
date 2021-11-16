<template>
  <v-modal :showModal="isOpen" @close="handleModalClose">
    <template #title>
      <h2 class="text-brand_primary">Contract Saved</h2>
    </template>
    <p>THIS IS THE CONTENT</p>
  </v-modal>
  <v-section :noPadding="true" class="bg-typography_primary">
    <div class="flex flex-row">
      <div class="flex flex-col w-6/12 bg-light rounded-r-2xl pt-sm pb-base px-md">
        <h2 class="text-center text-brand_primary">Features</h2>
        <div class="divide-y divide-typography_secondary">
          <div class="form--section">
            <h5 class="form--title">Contract Name <QuestionMarkCircleIcon class="form--title-icon" /></h5>
          </div>
          <div class="form--section">
            <h5 class="form--title">Permissions <QuestionMarkCircleIcon class="form--title-icon" /></h5>
          </div>
          <div class="form--section">
            <h5 class="form--title">Creation <QuestionMarkCircleIcon class="form--title-icon" /></h5>
          </div>
          <div class="form--section">
            <h5 class="form--title">Metadata <QuestionMarkCircleIcon class="form--title-icon" /></h5>
          </div>
        </div>
        <!-- ACTIONS -->
        <div class="flex flex-row items-center justify-center">
          <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="SAVE" @click="showModal"/>
          <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="DEPLOY" class="mx-sm" @click="showModal"/>
          <v-button format="primary" aria="Create a new NFT" :external="false" :white="false" text="DOWNLOAD" @click="showModal"/>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center w-6/12">RESULT</div>
    </div>
  </v-section>

  <v-section class="bg-typography_primary">
    <h2 class="text-center text-brand_primary mb-base">Fields Explained</h2>
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
import vModal from '@/components/modal.vue';
import vSection from '@/components/section.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/solid';

import { useRoute } from 'vue-router';
const route = useRoute();

import {ref} from 'vue';
const isOpen = ref(false);
const showModal = () => {
  isOpen.value = !isOpen.value;
}
const handleModalClose = () => {
  isOpen.value = false;
}

import { useMeta } from 'vue-meta';
useMeta({
  title: 'Contract Editor',
  description: 'This is the homepage to our project'
});
</script>

<style>
.form--title {
  @apply text-brand_primary flex items-center;
}

.form--title-icon {
  @apply h-6 w-6 text-brand_tertiary ml-xs;
}

.form--section {
  @apply py-sm;
}
</style>
