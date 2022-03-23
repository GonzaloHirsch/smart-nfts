<template>
    <v-header id="header-mobile">
        <nav class="flex flex-row justify-start items-center" aria-labelledby="header">
            <MenuIcon @click="toggleMenu" class="w-7 h-7 text-brand_secondary mr-sm cursor-pointer" :aria-label="$t('nav.menu.open.aria')" />
            <router-link to="/" @click="handleTopScroll(false)" class="text-h5 text-brand_secondary font-semibold" :aria-label="$t('nav.app.aria')">{{
                $t('app.name')
            }}</router-link>
        </nav>
        <div :class="['menu--visible', menuVisible ? 'translate-x-0' : 'menu--translated']">
            <router-link
                to="/"
                @click="handleTopScroll(true)"
                class="text-h5 text-brand_secondary font-semibold text-center"
                :aria-label="$t('nav.app.aria')"
                >{{ $t('app.name') }}</router-link
            >
            <XIcon
                @click="toggleMenu"
                class="w-8 h-8 text-brand_secondary mr-xs mt-xs cursor-pointer absolute top-0 right-0"
                :aria-label="$t('nav.menu.close.aria')"
            />
            <ul class="flex flex-col list-none items-center justify-center mt-base">
                <template v-for="(link, index) in links" :key="index">
                    <li class="my-sm">
                        <router-link
                            :to="link.to"
                            @click="toggleMenu"
                            class="text-body_xl text-brand_secondary font-medium"
                            :aria-label="$t(link.aria)"
                            >{{ $t(link.text) }}</router-link
                        >
                    </li>
                </template>
            </ul>
        </div>
        <div :class="['menu--overlay', menuVisible ? 'translate-x-0' : 'menu--translated']" @click="toggleMenu" />
    </v-header>
</template>

<script setup>
import { MenuIcon, XIcon } from '@heroicons/vue/solid';
import { ref } from 'vue';
import vHeader from '@/components/static/header.vue';

const links = [
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
        to: '/#Interact',
        text: 'nav.interact.text',
        aria: 'nav.interact.aria'
    },
    {
        to: '/#View',
        text: 'nav.list.text',
        aria: 'nav.list.aria'
    },
    {
        to: '/about',
        text: 'nav.about.text',
        aria: 'nav.about.aria'
    }
];

const handleTopScroll = (_toggleMenu) => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    if (_toggleMenu) toggleMenu();
};

const menuVisible = ref(false);
const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
    if (menuVisible.value) {
        document.body.classList.add('body-noscroll');
    } else {
        document.body.classList.remove('body-noscroll');
    }
};
</script>

<style scoped>
.menu--overlay {
    @apply bg-gray-600/25 absolute top-0 left-0 transform z-10;
    width: 100vw;
    height: 100vh;
}
.menu--visible {
    @apply bg-white absolute top-0 left-0 transform transition duration-300 z-20 flex flex-col py-sm px-sm drop-shadow-2xl;
    width: 250px;
    height: 100vh;
}
.menu--translated {
    @apply -translate-x-full !important;
}
.menu--shadow {
    @apply shadow-lg !important;
}
</style>
