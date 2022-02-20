<template>
    <div class="flex flex-row overflow-hidden">
        <div
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleFileDrag"
            class="border-2 border-white rounded-lg p-sm transition duration-300 w-full"
        >
            <input
                id="fileInput"
                type="file"
                @change="handleChangeFile"
                ref="fileInput"
                accept="image/*"
                class="w-px h-px opacity-0 overflow-hidden absolute"
            />
            <label for="fileInput" class="block cursor-pointer text-center">
                <div v-html="$t('inputs.placeholder.image')" />
                <strong v-if="selectedFile">{{ $t('inputs.text.image', [selectedFile.name]) }}</strong>
            </label>
        </div>
        <DocumentRemoveIcon
            :aria-label="$t('aria.imageUploadRemove')"
            @click="clearFile"
            :class="[selectedFile ? '' : 'translate-x-full w-0', 'text-error transition duration-300 cursor-pointer h-12 w-12 my-auto']"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { DocumentRemoveIcon } from '@heroicons/vue/solid';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        required: true
    }
});

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const fileInput = ref(null);
const selectedFile = ref(undefined);

const handleChangeFile = () => {
    selectedFile.value = fileInput.value.files[0];
    // Limit 5MB
    if (selectedFile.value.size > 5 * 1024) {
        selectedFile.value = undefined;
        setSnackbar(t('inputs.errors.image.tooBig'), 'error', 5);
    } else {
        emit('update:modelValue', fileInput.value.files[0]);
    }
};

// Handles drag and drop logic
const handleFileDrag = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('fileinput--hover');
    if (e.dataTransfer.files.length !== 1) {
        setSnackbar(t('inputs.errors.image.countLimit'), 'error', 5);
    } else if (!/^image\/.*$/.test(e.dataTransfer.files[0].type)) {
        setSnackbar(t('inputs.errors.image.type'), 'error', 5);
    } else if (e.dataTransfer.files[0].type > 5 * 1024) {
        setSnackbar(t('inputs.errors.image.tooBig'), 'error', 5);
    } else {
        fileInput.value.files = e.dataTransfer.files;
        // Manual trigger of the change file
        handleChangeFile();
    }
};

const handleDragOver = (e) => {
    e.preventDefault();
    if (!e.currentTarget.classList.contains('fileinput--hover')) {
        e.currentTarget.classList.add('fileinput--hover');
    }
};

const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('fileinput--hover');
};

// Removes the file
const clearFile = () => {
    fileInput.value.value = '';
    selectedFile.value = undefined;
    emit('update:modelValue', undefined);
};
</script>

<style scoped>
.fileinput--hover {
    @apply bg-brand_primary border-brand_secondary;
}
</style>
