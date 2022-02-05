<template>
    <div class="flex flex-col">
        <template v-for="(fact, index) in props.facts" :key="index">
            <div class="w-full my-sm md:my-base flex flex-row items-start justify-center">
                <component class="vertical-fact--image mr-base" :is="fact.icon" />
                <div>
                    <p v-if="fact.title" class="text-lg md:text-h4 leading-normal text-brand_secondary mb-sm font-bold" v-html="fact.title"></p>
                    <p v-if="fact.description" class="mt-sm text-base text-left" v-html="fact.description"></p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    facts: { type: Array, required: true }
});
</script>
