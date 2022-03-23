<template>
    <header
        :id="props.id"
        :class="[
            'sticky top-0 left-0 px-sm md:px-base lg:px-xl py-sm bg-white w-full z-50 transition duration-300',
            isScrolled ? 'header--shadow' : ''
        ]"
    >
        <slot />
    </header>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { NAVBAR_SCROLL_LIMIT } from '@/js/constants.js';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > NAVBAR_SCROLL_LIMIT;
};
window.addEventListener('scroll', handleScroll);
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.header--shadow {
    @apply shadow-lg !important;
}
</style>
