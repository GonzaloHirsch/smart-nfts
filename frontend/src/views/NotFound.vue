<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-gray-900">Not Found</h1>
    </div>
  </header>
</template>

<script setup>
import { useMeta } from 'vue-meta';

useMeta({ title: 'Not Found', description: "The page you are looking for doesn't exist" });
</script>
