<template>
  <button :class="[buttonFormat, 'button']">
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

const props = defineProps({
  href: {
    type: String
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
  }
});
const buttonFormat = computed(() => (props.white ? `button--${props.format}-white` : `button--${props.format}`));
</script>

<style scoped>
.button {
  @apply rounded px-sm py-xs transition duration-200 cursor-pointer;
}

/* PRIMARY FORMAT */
.button--primary {
  @apply border-2 border-brand_primary text-brand_primary bg-transparent;
}
.button--primary:hover {
  @apply bg-brand_primary text-white;
}
.button--primary-white {
  @apply border-2 border-white text-white bg-transparent;
}
.button--primary-white:hover {
  @apply text-brand_primary bg-white;
}

/* SECONDARY FORMAT */
.button--secondary {
  @apply border-2 border-brand_secondary text-brand_secondary bg-transparent;
}
.button--secondary:hover {
  @apply bg-brand_secondary text-white;
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
</style>