<template>
    <header id="header" class="sticky top-0 left-0 px-sm md:px-base lg:px-xl py-sm bg-white w-full shadow z-10">
        <nav class="flex flex-row justify-between items-center" aria-labelledby="header">
            <router-link to="/" class="text-h5 text-brand_secondary font-semibold">{{ $t('app.name') }}</router-link>
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
const links = [
    {
        to: '/create',
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
</script>
