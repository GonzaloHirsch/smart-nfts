<template>
    <div class="flex flex-col items-center justify-center h-auto p-xs bg-brand_tertiary/10 border border-brand_secondary rounded-md token-boost">
        <div class="relative">
            <svg :height="props.radius * 2" :width="props.radius * 2" class="stroke-brand_secondary">
                <circle
                    stroke="#C0C0C0"
                    stroke-dasharray="360 360"
                    :style="{ zIndex: 1 }"
                    :stroke-width="props.stroke"
                    fill="transparent"
                    :r="calculations.normalizedRadius"
                    :cx="props.radius"
                    :cy="props.radius"
                />
                <circle
                    stroke="currentFill"
                    :stroke-dasharray="calculations.circumference + ' ' + calculations.circumference"
                    :style="{ strokeDashoffset: strokeDashoffset, zIndex: 2 }"
                    :stroke-width="props.stroke"
                    fill="transparent"
                    :r="calculations.normalizedRadius"
                    :cx="props.radius"
                    :cy="props.radius"
                />
            </svg>
            <LightningBoltIcon class="w-8 h-8 absolute top-0 left-0 right-0 bottom-0 m-auto text-brand_secondary"/>
        </div>
        <span class="block text-sm text-brand_secondary">{{ props.name }}</span>
        <span class="block font-semibold">+{{ props.value }}{{props.isPercentage ? '%' : ''}}</span>
    </div>
</template>

<script setup>
import {computed} from 'vue';
import { LightningBoltIcon } from '@heroicons/vue/solid';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    isPercentage: {
        type: Boolean,
        required: true
    },
    stroke: {
        type: Number,
        default: 2
    },
    radius: {
        type: Number,
        default: 20
    }
});

const calculations = computed(() => {
    const normalizedRadius = props.radius - props.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    return {
        normalizedRadius,
        circumference
    }
});

const strokeDashoffset = computed(() => {
    let value = props.value;
    if (!props.isPercentage) {
        value = props.value % 100;
    }
    return calculations.value.circumference - value / 100 * calculations.value.circumference;
})
</script>

<style scoped>
.token-boost {
    @apply shadow-md shadow-brand_primary !important;
}
</style>