<template>
    <v-header>
        <nav class="flex flex-row justify-between items-center" aria-labelledby="header">
            <router-link to="/" @click="handleTopScroll" class="text-h5 text-brand_secondary font-semibold" :aria-label="$t('nav.app.aria')">{{
                $t('app.name')
            }}</router-link>
            <ul class="flex flex-row list-none">
                <template v-for="(link, index) in links" :key="index">
                    <li class="mr-base last:mr-0">
                        <router-link :to="link.to" class="text-body_xl text-brand_secondary font-medium" :aria-label="$t(link.aria)">{{
                            $t(link.text)
                        }}</router-link>
                    </li>
                </template>
            </ul>
        </nav>
    </v-header>
</template>

<script setup>
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

const handleTopScroll = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};
</script>
