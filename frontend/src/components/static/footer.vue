<template>
    <footer id="footer" class="p-sm pt-base flex flex-col items-center bg-brand_secondary">
        <div class="grid grid-cols-1 md:grid-cols-7 w-11/12 mx-auto text-white">
            <div class="col-span-3">
                <router-link to="/" @click="handleTopScroll" class="text-h5 leading-normal font-semibold w-full md:w-5/12">{{
                    $t('app.name')
                }}</router-link>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <div class="w-10/12">
                    <span class="text-base">{{ $t('footer.made') }}</span>
                    <a
                        class="ml-1 text-base hover:underline"
                        href="https://www.linkedin.com/in/florencia-petrikovich-a2b3aa1a6/?originalSubdomain=ar"
                        target="_blank"
                        rel="noopener noreferer"
                        aria-label="Learn more about Florencia Petrikovich"
                        >Florencia Petrikovich</a
                    >
                    <span class="mx-1 text-base">&</span>
                    <a
                        class="text-base hover:underline"
                        href="https://www.linkedin.com/in/gonzalo-hirsch/"
                        target="_blank"
                        rel="noopener noreferer"
                        aria-label="Learn more about Gonzalo Hirsch"
                        >Gonzalo Hirsch</a
                    >. <span class="text-base">{{ $t('footer.madeContinued') }}</span>
                </div>
            </div>
            <div class="col-span-2 my-sm md:my-0">
                <span class="text-h5 leading-normal font-semibold">{{ $t('nav.features') }}</span>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <ul class="flex flex-col list-none">
                    <li class="mb-xs">
                        <router-link to="/#Create" class="text-lg font-medium">{{ $t('nav.create') }}</router-link>
                    </li>
                    <li class="my-xs">
                        <router-link to="/#Edit" class="text-lg font-medium">{{ $t('nav.edit') }}</router-link>
                    </li>
                    <li class="mt-xs">
                        <router-link to="/interact" class="text-lg font-medium">{{ $t('nav.interact') }}</router-link>
                    </li>
                </ul>
            </div>
            <div class="col-span-2 my-sm md:my-0">
                <span class="text-h5 leading-normal font-semibold text-left">{{ $t('nav.contact') }}</span>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <ul class="flex flex-col list-none">
                    <li class="mb-xs">
                        <a class="text-lg font-medium" href="mailto:ghirsch@itba.edu.ar">ghirsch@itba.edu.ar</a>
                    </li>
                    <li class="my-xs">
                        <a class="text-lg font-medium" href="mailto:fpetrikovich@itba.edu.ar">fpetrikovich@itba.edu.ar</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center w-full text-body_xs mt-base text-typography_primary text-center md:text-left">
            <div class="mb-sm md:mb-0">
                <span class="text-body_xs">{{ $t('footer.copyright') }}</span>
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

<script setup>
const handleTopScroll = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};
</script>

<style scoped>
.footer-link {
    @apply text-body_xs;
}
.footer-link:hover {
    @apply underline;
}
</style>
