<template>
    <button
        :class="{
            button: true,
            'button--primary': !props.white && props.format === 'primary',
            'button--primary-white': props.white && props.format === 'primary',
            'button--secondary': !props.white && props.format === 'secondary',
            'button--secondary-white': props.white && props.format === 'secondary',
            'button--tertiary': !props.white && props.format === 'tertiary',
            'button--tertiary-white': props.white && props.format === 'tertiary',
            'button--danger': !props.white && props.format === 'danger',
            'button--danger-white': props.white && props.format === 'danger',
            'button--disabled': !props.white && props.format === 'disabled',
            'button--disabled-white': props.white && props.format === 'disabled',
            'button--size-large': props.size === 'large',
            'button--size-medium': props.size === 'medium',
            'button--size-small': props.size === 'small',
            'button--size-xsmall': props.size === 'xsmall'
        }"
        type="button"
        :disabled="props.disabled"
    >
        <span v-if="props.loading" class="no-inherit button-spinner--wrapper">
            <v-spinner class="animate-spin-reverse button-spinner" />
        </span>
        <template v-if="props.external">
            <a :href="props.href" :target="props.target" :aria-label="props.aria">{{ props.text }}</a>
        </template>
        <template v-else-if="props.href">
            <router-link :to="props.href" :target="props.target" :aria-label="props.aria">{{ props.text }}</router-link>
        </template>
        <template v-else>
            <span>{{ props.text }}</span>
        </template>
    </button>
</template>

<script setup>
import { computed } from 'vue';
import vSpinner from '@/components/icons/spinner.vue';

const props = defineProps({
    href: {
        type: String,
        default: undefined
    },
    target: {
        type: String,
        default: '_blank'
    },
    aria: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    external: {
        type: Boolean,
        default: false
    },
    white: {
        type: Boolean,
        default: false
    },
    format: {
        type: String,
        default: 'primary'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'large'
    }
});
</script>

<style scoped>
.button {
    @apply rounded transition duration-200 cursor-pointer inline-flex;
}

/* PRIMARY FORMAT */
.button--primary {
    @apply border-2 border-brand_secondary text-brand_secondary bg-transparent;
}
.button--primary:hover {
    @apply bg-brand_secondary text-white;
}
.button--primary-white {
    @apply border-2 border-white text-white bg-transparent;
}
.button--primary-white:hover {
    @apply text-brand_secondary bg-white;
}

/* SECONDARY FORMAT */
.button--secondary {
    @apply border-2 border-brand_secondary text-white bg-brand_secondary;
}
.button--secondary:hover {
    @apply bg-brand_secondary/80 text-white;
}
.button--secondary-white {
    @apply border-2 border-white text-white bg-transparent;
}
.button--secondary-white:hover {
    @apply text-brand_secondary bg-white;
}

/* TERTIARY FORMAT */
.button--tertiary {
    @apply border-2 border-brand_tertiary text-brand_tertiary bg-transparent;
}
.button--tertiary:hover {
    @apply bg-brand_tertiary text-white;
}
.button--tertiary-white {
    @apply border-2 border-white text-white bg-transparent;
}
.button--tertiary-white:hover {
    @apply text-brand_tertiary bg-white;
}

/* DANGER FORMAT */
.button--danger {
    @apply border-2 border-error text-error bg-transparent;
}
.button--danger:hover {
    @apply bg-error text-white;
}
.button--danger-white {
    @apply border-2 border-white text-white bg-transparent;
}
.button--danger-white:hover {
    @apply text-error bg-white;
}

/* DISABLED FORMAT */
.button--disabled {
    @apply border-2 border-gray-400 text-gray-400 bg-gray-400 bg-opacity-50 cursor-not-allowed;
}
.button--disabled-white {
    @apply border-2 border-gray-400 text-gray-400 bg-gray-400 bg-opacity-50 cursor-not-allowed;
}

/* BUTTONS */
.button.button--size-xsmall a,
.button.button--size-xsmall span {
    @apply text-xs px-xs py-xs;
}

.button.button--size-small a,
.button.button--size-small span {
    @apply text-xs px-xs py-xs;
}

.button.button--size-medium a,
.button.button--size-medium span {
    @apply text-sm px-xs py-xs;
}

.button.button--size-large a,
.button.button--size-large span {
    @apply text-lg px-xs py-xs;
}

@screen md {
    .button.button--size-large a,
    .button.button--size-large span {
        @apply text-h5 px-sm py-sm;
    }

    .button.button--size-medium a,
    .button.button--size-medium span {
        @apply text-lg px-xs py-xs;
    }

    .button.button--size-small a,
    .button.button--size-small span {
        @apply text-sm px-xs py-xs;
    }
}

.button.button--size-large .button-spinner--wrapper {
    @apply pl-sm pr-xs -mr-xs;
}

.button.button--size-medium .button-spinner--wrapper {
    @apply my-auto pl-xs pr-xs -mr-xs;
}

.button.button--size-small .button-spinner--wrapper {
    @apply my-auto pl-2 pr-2 -mr-2;
}

.button.button--size-xsmall .button-spinner--wrapper {
    @apply my-auto pl-1 pr-1 -mr-1;
}

.button.button--size-medium .button-spinner {
    @apply w-4 h-4;
}
</style>
