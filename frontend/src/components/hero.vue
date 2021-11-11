<template>
    <v-section :fullHeight="props.fullHeight" :noPadding="props.noPadding" class="flex flex-row items-center justify-center">
        <div class="flex flex-col items-center justify-center">
            <slot/>
        </div>
    </v-section>
</template>

<script setup>
import vSection from '@/components/section.vue';

const props = defineProps({
    fullHeight: {
        type: Boolean,
        default: false
    },
    noPadding: {
        type: Boolean,
        default: false
    }
});
</script>
