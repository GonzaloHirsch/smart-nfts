<template>
    <header
        id="header"
        :class="['sticky top-0 left-0 px-sm md:px-base lg:px-xl py-sm bg-white w-full z-10 transition duration-300', isScrolled ? 'menu--shadow' : '']"
    >
        <nav class="flex flex-row justify-start items-center" aria-labelledby="header">
            <MenuIcon @click="toggleMenu" class="w-6 h-6 text-brand_secondary mr-sm cursor-pointer" />
            <router-link to="/" @click="handleTopScroll(false)" class="text-h5 text-brand_secondary font-semibold">{{ $t('app.name') }}</router-link>
        </nav>
        <div :class="['menu--visible', menuVisible ? 'translate-x-0' : 'menu--translated']">
            <router-link to="/" @click="handleTopScroll(true)" class="text-h5 text-brand_secondary font-semibold text-center">{{
                $t('app.name')
            }}</router-link>
            <XIcon @click="toggleMenu" class="w-6 h-6 text-brand_secondary mr-xs mt-xs cursor-pointer absolute top-0 right-0" />
            <ul class="flex flex-col list-none items-center justify-center mt-base">
                <template v-for="(link, index) in links" :key="index">
                    <li class="my-sm">
                        <router-link :to="link.to" @click="toggleMenu" class="text-body_xl text-brand_secondary font-medium">{{
                            $t(link.text)
                        }}</router-link>
                    </li>
                </template>
            </ul>
        </div>
        <div :class="['menu--overlay', menuVisible ? 'translate-x-0' : 'menu--translated']" @click="toggleMenu" />
    </header>
</template>

<script setup>
import { MenuIcon, XIcon } from '@heroicons/vue/solid';
import { ref, onUnmounted } from 'vue';

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
    }
];

const handleTopScroll = (toggleMenu) => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    if (toggleMenu) toggleMenu();
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

const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};
window.addEventListener('scroll', handleScroll);
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.menu--overlay {
    @apply bg-gray-600/25 absolute top-0 left-0 transform transition duration-300 z-10;
    width: 100vw;
    height: 100vh;
}
.menu--visible {
    @apply bg-white absolute top-0 left-0 transform transition duration-300 z-20 flex flex-col py-sm px-sm;
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
