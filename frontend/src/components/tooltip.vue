<template>
    <div class="tooltip-container">
        <slot />
        <div
            :class="[
                'tooltip',
                props.positionY === 'top' ? 'tooltip--top' : '',
                props.positionY === 'bottom' ? 'tooltip--bottom' : '',
                props.positionX === 'left' ? 'tooltip--left' : '',
                props.positionX === 'right' ? 'tooltip--right' : '',
                props.positionX === 'center' ? 'tooltip--center' : ''
            ]"
        >
            <span class="text">{{ props.text }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    positionY: {
        type: String,
        default: 'top'
    },
    positionX: {
        type: String,
        default: 'center'
    }
});
</script>

<style scoped>
.tooltip-container {
    @apply relative inline-block;
}

.tooltip-container .tooltip {
    @apply hidden;
}

.tooltip-container:hover .tooltip {
    @apply block opacity-100 !important;
}

.tooltip {
    @apply text-white text-center p-1 rounded w-32 -ml-16 opacity-0 duration-300 absolute bg-gray-800;
    z-index: 1;
}

.tooltip--top {
    bottom: 100%;
}

.tooltip--bottom {
    top: 100%;
}

.tooltip--left {
    right: 50%;
}

.tooltip--right {
    left: 100%;
}

.tooltip--center {
    left: 50%;
}

.text::after {
    @apply absolute border-gray-800;
    content: '  ';
    border-style: solid;
    border-color: #000000 transparent transparent transparent;
}

.text {
    @apply text-sm;
}

.tooltip--top .text::after {
    top: 100%;
    margin-left: -5px;
    border-width: 5px;
}

.tooltip--bottom .text::after {
    transform: rotate(180deg);
    bottom: 100%;
    margin-left: -5px;
    border-width: 5px;
}

.tooltip--left .text::after {
    left: 80%;
}

.tooltip--right .text::after {
    right: 80%;
}

.tooltip--center .text::after {
    left: 50%;
}
</style>
