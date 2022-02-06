<template>
    <div class="flex flex-row flex-wrap">
        <template v-for="(fact, index) in props.facts" :key="index">
            <div class="w-full md:w-4/12 my-sm md:my-0 flex flex-col items-center justify-center px-base">
                <component class="fact--image" :is="fact.icon" />
                <p v-if="fact.title" class="text-h5 md:text-h4 leading-normal text-brand_secondary mb-xs md:mb-sm font-bold" v-html="fact.title"></p>
                <p v-if="fact.description" class="mt-xs mb:mt-sm text-lg text-center" v-html="fact.description"></p>
            </div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    facts: { type: Array, required: true }
});
</script>
