<template>
    <div class="flex flex-col mt-xs">
        <div class="grid grid-cols-7" v-if="props.modelValue.length > 0">
            <span class="col-span-2 pl-xs">Name</span>
            <span class="col-span-2 pl-xs">Type</span>
            <span class="col-span-2 pl-xs">Display</span>
        </div>
        <v-metadata-field
            v-for="(field, index) in props.modelValue"
            :key="index"
            :id="index"
            v-model:name="field.name"
            v-model:type="field.type"
            v-model:display="field.display"
            :names="currentNames"
            @removeField="handleRemoveField"
        />
        <span
            @click="canAddField ? handleAddField() : undefined"
            :class="['w-fit flex transition duration-200 mt-xs', canAddField ? 'cursor-pointer hover:text-brand_secondary' : 'text-gray-500']"
            ><PlusCircleIcon class="w-6 h-6 mr-1" /> Add Attribute</span
        >
    </div>
</template>

<script setup>
import vMetadataField from '@/components/editor/metadata/metadataField.vue';
import { ref, computed } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/solid';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    }
});

const canAddField = computed(() => {
    return props.modelValue.length === 0 || props.modelValue.filter((el) => el.name === undefined || el.name === '' || el.name === null).length === 0;
});

const currentNames = computed(() => {
    return props.modelValue.map(field => field.name).reduce((obj, field) => {
        if (!(field in obj)) {
            obj[field] = 0;
        }
        obj[field] = obj[field] + 1;
        return obj;
    }, {});
})

const handleAddField = () => {
    props.modelValue.push({
        name: undefined,
        type: 'string',
        display: undefined
    });
    emit('update:modelValue', props.modelValue);
};

const handleRemoveField = (index) => {
    props.modelValue.splice(index, 1);
    console.log(props.modelValue);
    emit('update:modelValue', props.modelValue);
};
</script>
