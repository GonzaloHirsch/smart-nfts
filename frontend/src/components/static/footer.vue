<template>
    <footer id="footer" class="p-sm pt-base flex flex-col items-center bg-brand_secondary">
        <div class="grid grid-cols-1 lg:grid-cols-9 w-11/12 mx-auto text-white">
            <div class="col-span-3">
                <router-link
                    to="/"
                    @click="handleTopScroll"
                    class="text-h5 leading-normal font-semibold w-full lg:w-5/12"
                    :aria-label="$t('footer.app.aria')"
                    >{{ $t('app.name') }}</router-link
                >
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <div class="w-10/12">
                    <span class="text-base">{{ $t('footer.made') }}</span>
                    <a
                        class="ml-1 text-base hover:underline"
                        href="https://www.linkedin.com/in/florencia-petrikovich-a2b3aa1a6/?originalSubdomain=ar"
                        target="_blank"
                        rel="noopener noreferer"
                        :aria-label="$t('footer.learnMore.aria', ['Florencia Petrikovich'])"
                        >Florencia Petrikovich</a
                    >
                    <span class="mx-1 text-base">&</span>
                    <a
                        class="text-base hover:underline"
                        href="https://www.linkedin.com/in/gonzalo-hirsch/"
                        target="_blank"
                        rel="noopener noreferer"
                        :aria-label="$t('footer.learnMore.aria', ['Gonzalo Hirsch'])"
                        >Gonzalo Hirsch</a
                    >. <span class="text-base">{{ $t('footer.madeContinued') }}</span>
                </div>
            </div>
            <div class="col-span-2 my-sm lg:my-0">
                <span class="text-h5 leading-normal font-semibold">{{ $t('nav.features') }}</span>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <ul class="flex flex-col list-none">
                    <template v-for="(link, index) in featureLinks" :key="index">
                        <li class="footer--link">
                            <router-link :to="link.to" class="text-lg font-medium" :aria-label="$t(link.aria)">{{ $t(link.text) }}</router-link>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="col-span-2 my-sm lg:my-0">
                <router-link to="/about/" class="text-h5 leading-normal font-semibold">{{ $t('nav.about.text') }}</router-link>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <ul class="flex flex-col list-none">
                    <template v-for="(link, index) in aboutLinks" :key="index">
                        <li class="footer--link">
                            <router-link :to="link.to" class="text-lg font-medium" :aria-label="$t(link.aria)">{{ $t(link.text) }}</router-link>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="col-span-2 my-sm lg:my-0">
                <span class="text-h5 leading-normal font-semibold text-left">{{ $t('nav.contact') }}</span>
                <div class="col-span-full h-1 bg-white my-sm"></div>
                <ul class="flex flex-col list-none">
                    <li class="mb-xs">
                        <a
                            class="text-lg font-medium"
                            href="mailto:ghirsch@itba.edu.ar"
                            :aria-label="$t('footer.contact.aria', ['ghirsch@itba.edu.ar'])"
                            >ghirsch@itba.edu.ar</a
                        >
                    </li>
                    <li class="my-xs">
                        <a
                            class="text-lg font-medium"
                            href="mailto:fpetrikovich@itba.edu.ar"
                            :aria-label="$t('footer.contact.aria', ['fpetrikovich@itba.edu.ar'])"
                            >fpetrikovich@itba.edu.ar</a
                        >
                    </li>
                </ul>
            </div>
        </div>
        <div
            class="flex flex-col lg:flex-row justify-between items-center w-full text-body_xs mt-base text-typography_primary text-center lg:text-left"
        >
            <div class="mb-sm lg:mb-0 flex flex-col">
                <span class="text-body_xs">{{ $t('footer.copyright') }}</span>
            </div>
            <a
                class="footer--link-uni"
                href="https://www.itba.edu.ar/"
                target="_blank"
                rel="noopener noreferer"
                :aria-label="$t('footer.location.aria')"
                >{{ $t('footer.location.text') }}</a
            >
        </div>
    </footer>
</template>

<script setup>
const handleTopScroll = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

const featureLinks = [
    {
        to: '/#Create',
        text: 'nav.create.text',
        aria: 'nav.create.aria'
    },
    {
        to: '/#Edit',
        text: 'nav.edit.text',
        aria: 'nav.edit.aria'
    },
    {
        to: '/interact',
        text: 'nav.interact.text',
        aria: 'nav.interact.aria'
    },
    {
        to: '/tokens',
        text: 'nav.list.text',
        aria: 'nav.list.aria'
    }
];
const aboutLinks = [
    {
        to: '/about#erc-721',
        text: 'nav.erc721.text',
        aria: 'nav.erc721.aria'
    },
    {
        to: '/about#technologies',
        text: 'nav.technologies.text',
        aria: 'nav.technologies.aria'
    },
    {
        to: '/about#how-it-works',
        text: 'nav.howItWorks.text',
        aria: 'nav.howItWorks.aria'
    },
    {
        to: '/status/',
        text: 'nav.status.text',
        aria: 'nav.status.aria'
    }
];
</script>

<style scoped>
.footer--link-uni {
    @apply text-body_xs;
}
.footer--link-uni:hover {
    @apply underline;
}

.footer--link:hover {
    @apply underline;
}

.footer--link:not(:first-of-type):not(:last-of-type) {
    @apply my-xs;
}

.footer--link:first-of-type {
    @apply mb-xs;
}

.footer--link:last-of-type {
    @apply mt-xs;
}
</style>
