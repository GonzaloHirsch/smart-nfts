<template>
    <Popper class="tooltip" :content="text" :hover="true" :placement="positionY" :arrow="true">
        <slot />
    </Popper>
</template>

<script setup>
import Popper from 'vue3-popper';

defineProps({
    text: {
        type: String,
        required: true
    },
    positionY: {
        type: String,
        default: 'top'
    }
});
</script>
