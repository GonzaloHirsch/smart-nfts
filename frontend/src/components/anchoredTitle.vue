<template>
    <component
        :is="props.type"
        @mouseenter="visibleIcon = true"
        @mouseleave="visibleIcon = false"
        :class="[
            'flex flex-row items-center relative',
            classes.text,
            isFocused ? 'underline decoration-brand_secondary decoration-4 underline-offset-2' : ''
        ]"
    >
        <span :id="props.anchor" class="absolute left-0" :style="anchorStyle"></span>
        {{ props.text }}
        <LinkIcon
            v-if="visibleIcon"
            :aria-label="$t('aria.anchorLinks', [props.type])"
            :class="[iconClass, 'ml-2 cursor-pointer transition duration-200 opacity-30 hover:opacity-100', classes.icon]"
            @click="routeToLink"
        />
    </component>
</template>

<script setup>
import { LinkIcon } from '@heroicons/vue/solid';
import { NAV_HEIGHT } from '@/js/constants.js';
import { computed, ref, inject } from 'vue';
const props = defineProps({
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    anchor: {
        type: String,
        required: true
    },
    format: {
        type: String,
        default: 'primary'
    }
});

const visibleIcon = ref(false);

const iconClass = computed(() => {
    let _class = '';
    switch (props.type) {
        case 'h1':
            _class += 'h-11 w-11';
            break;
        case 'h2':
            _class += 'h-8 w-8';
            break;
        case 'h3':
            _class += 'h-7 w-7';
            break;
        case 'h4':
            _class += 'h-6 w-6';
            break;
        case 'h5':
            _class += 'h-5 w-5';
            break;
    }
    return _class;
});

import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const routeToLink = () => {
    router.push({
        hash: `#${props.anchor}`
    });
};

const route = useRoute();
const isFocused = computed(() => route.hash === `#${props.anchor}`);

// Anchor Style
const navHeight = inject(NAV_HEIGHT);
const anchorStyle = computed(() => {
    return navHeight.value ? { top: `-${navHeight.value}px` } : { top: '0' };
});

const classes = computed(() => {
    switch (props.format) {
        case 'primary':
            return {
                text: 'text-typograpy_primary',
                icon: 'hover:text-brand_secondary'
            };
    }
});
</script>
