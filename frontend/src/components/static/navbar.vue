<template>
  <header class="sticky top-0 left-0 px-sm md:px-base lg:px-xl py-sm bg-white w-full">
    <nav role="nav" class="flex flex-row justify-between items-center">
      <router-link to="/" class="text-h5 text-brand_primary font-semibold">{{ $t('app.name') }}</router-link>
      <ul class="flex flex-row list-none">
        <li>
          <router-link to="/create" class="text-body_xl text-brand_primary font-medium mr-sm">{{ $t('nav.create') }}</router-link>
        </li>
        <li>
          <router-link to="/interact" class="text-body_xl text-brand_primary font-medium">{{ $t('nav.interact') }}</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup></script>
