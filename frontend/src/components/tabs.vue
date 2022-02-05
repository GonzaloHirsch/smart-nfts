<template>
    <div class="w-full relative">
        <template v-for="(tab, index) in props.tabs" :key="index">
            <v-hidden-anchor :anchor="tab" :distanceMultiplier="3"/>
        </template>
        <TabGroup @change="changedTab" :defaultIndex="customDefaultIndex" :key="customDefaultIndex">
            <TabList class="flex p-1 space-x-1 bg-brand_primary rounded-lg max-w-md mb-sm absolute top-0 left-0 w-full">
                <Tab v-for="tab in props.tabs" as="template" :key="tab" v-slot="{ selected }">
                    <button
                        :class="[
                            'w-full py-xs text-sm sm:text-base md:text-h5 leading-1 font-medium text-black rounded-md',
                            'focus:outline-none focus:ring-2 ring-brand_secondary ring-opacity-60',
                            selected ? 'bg-brand_tertiary p-6 shadow' : 'text-brand_secondary hover:bg-brand_tertiary/20 hover:text-brand_secondary'
                        ]"
                    >
                        {{ tab }}
                    </button>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="(tab, idx) in tabs" :key="idx" :class="['focus:outline-none']">
                    <slot :name="tab" />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import vHiddenAnchor from '@/components/hiddenAnchor.vue';

const props = defineProps({
    tabs: {
        type: Array,
        default: []
    }
});

const customDefaultIndex = ref(0);
const route = useRoute();
const router = useRouter();

const changedTab = (index) => {
    customDefaultIndex.value = index;
    router.replace({
        hash: `#${props.tabs[index]}`
    })
}

watch(() => route.hash, () => {
    let _index = 0;
    if (route.hash) {
        let cleanHash = route.hash.replace('#', '');
        props.tabs.forEach((tab, index) => {
            if (tab === cleanHash) _index = index;
        })
    }
    customDefaultIndex.value = _index;
}, {immediate: true, deep: true})
</script>
