<template>
    <button
        :class="{
            button: true,
            'button--primary': !white && format === 'primary',
            'button--primary-white': white && format === 'primary',
            'button--secondary': !white && format === 'secondary',
            'button--secondary-white': white && format === 'secondary',
            'button--tertiary': !white && format === 'tertiary',
            'button--tertiary-white': white && format === 'tertiary',
            'button--danger': !white && format === 'danger',
            'button--danger-white': white && format === 'danger',
            'button--disabled': !white && format === 'disabled',
            'button--disabled-white': white && format === 'disabled',
            'button--size-large': size === 'large',
            'button--size-medium': size === 'medium',
            'button--size-small': size === 'small',
            'button--size-xsmall': size === 'xsmall'
        }"
        type="button"
        :disabled="disabled"
    >
        <span v-if="loading" class="no-inherit button-spinner--wrapper">
            <v-spinner class="animate-spin-reverse button-spinner" />
        </span>
        <template v-if="external">
            <a :href="href" :target="target" :aria-label="aria">{{ text }}</a>
        </template>
        <template v-else-if="href">
            <router-link :to="href" :target="target" :aria-label="aria">{{ text }}</router-link>
        </template>
        <template v-else>
            <span>{{ text }}</span>
        </template>
    </button>
</template>

<script setup>
import vSpinner from '@/components/icons/spinner.vue';

defineProps({
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
    @apply text-xs px-1 py-1;
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
    @apply my-auto pl-1 pr-1 -mr-2;
}

.button.button--size-xsmall .button-spinner {
    @apply w-3 h-3;
}

.button.button--size-medium .button-spinner {
    @apply w-4 h-4;
}
</style>
