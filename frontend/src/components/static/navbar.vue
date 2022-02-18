<template>
    <header
        id="header"
        :class="['sticky top-0 left-0 px-sm md:px-base lg:px-xl py-sm bg-white w-full z-50 transition duration-300', isScrolled ? 'shadow-lg' : '']"
    >
        <nav class="flex flex-row justify-between items-center" aria-labelledby="header">
            <router-link to="/" @click="handleTopScroll" class="text-h5 text-brand_secondary font-semibold">{{ $t('app.name') }}</router-link>
            <ul class="flex flex-row list-none">
                <template v-for="(link, index) in links" :key="index">
                    <li class="mr-base last:mr-0">
                        <router-link :to="link.to" class="text-body_xl text-brand_secondary font-medium">{{ $t(link.text) }}</router-link>
                    </li>
                </template>
            </ul>
        </nav>
    </header>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { NAVBAR_SCROLL_LIMIT } from '@/js/constants.js';

const links = [
    {
        to: '/#Create',
        text: 'nav.create'
    },
    {
        to: '/#Edit',
        text: 'nav.edit'
    },
    {
        to: '/interact',
        text: 'nav.interact'
    },
    {
        to: '/tokens',
        text: 'nav.list'
    }
];

const handleTopScroll = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > NAVBAR_SCROLL_LIMIT;
};
window.addEventListener('scroll', handleScroll);
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
