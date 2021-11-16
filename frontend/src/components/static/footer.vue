<template>
  <footer class="p-xs flex flex-col items-center bg-brand_secondary">
    <div class="flex flex-col items-center justify-center py-md text-typography_primary">
      <router-link to="/" class="text-h2 font-semibold mb-xl">{{ $t('app.name') }}</router-link>
      <nav role="nav" class="flex flex-row justify-between items-center">
        <ul class="flex flex-row list-none">
          <li>
            <router-link to="/create" class="text-h5 font-medium mr-md">{{ $t('nav.create') }}</router-link>
          </li>
          <li>
            <router-link to="/interact" class="text-h5 font-medium">{{ $t('nav.interact') }}</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="flex flex-col md:flex-row justify-between items-center w-full text-body_xs mt-base text-typography_primary">
      <div class="mb-sm md:mb-0">
        <span class="text-body_xs">{{ $t('footer.made') }}</span>
        <a
          class="ml-1 footer-link"
          href="https://www.linkedin.com/in/florencia-petrikovich-a2b3aa1a6/?originalSubdomain=ar"
          target="_blank"
          rel="noopener noreferer"
          aria-label="Learn more about Florencia Petrikovich"
          >Florencia Petrikovich</a
        >
        <span class="mx-1 text-body_xs">&</span>
        <a
          class="footer-link"
          href="https://www.linkedin.com/in/gonzalo-hirsch/"
          target="_blank"
          rel="noopener noreferer"
          aria-label="Learn more about Gonzalo Hirsch"
          >Gonzalo Hirsch</a
        >
      </div>
      <a
        class="footer-link"
        href="https://www.itba.edu.ar/"
        target="_blank"
        rel="noopener noreferer"
        aria-label="Learn more about the Instituto Tecnológico de Buenos Aires (ITBA)"
        >{{ $t('footer.location') }}</a
      >
    </div>
  </footer>
</template>

<style scoped>
.footer-link{
    @apply text-body_xs;
}
.footer-link:hover{
    @apply underline;
}
</style>