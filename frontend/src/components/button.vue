<template>
  <button :class="[buttonFormat, buttonSize, 'button']" type="button" :disabled="props.disabled">
    <span v-if="props.loading" class="no-inherit button-spinner--wrapper">
      <v-spinner class="animate-spin button-spinner" />
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
  },
  sizeMobile: {
    type: String,
    default: 'xsmall'
  }
});
const buttonFormat = computed(() => (props.white ? `button--${props.format}-white` : `button--${props.format}`));
const buttonSize = computed(() => `button--size-${props.sizeMobile ?? props.size} md:button--size-${props.size}`);
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
</style>
