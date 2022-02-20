<template>
    <div class="flex flex-col md:flex-row items-center" autocomplete="off">
        <v-input
            id="contract_id"
            name="contract_id"
            :label="$t('labels.contractId')"
            :hideLabel="true"
            :placeholder="$t('placeholders.contractId')"
            v-model="contractId"
            :continuousInput="true"
            format="primary-white"
            class="mb-xs md:mr-sm md:mb-0"
            :size="props.button.size"
            autocomplete="contractId"
        />
        <v-button
            :format="editDisabled ? 'disabled' : props.button.format"
            :aria="$t(props.button.aria)"
            :external="false"
            :white="false"
            :text="$t(props.button.text)"
            :disabled="editDisabled"
            :loading="isLoading"
            :size="props.button.size"
            @click="handleClick"
        />
    </div>
</template>

<script setup>
import vButton from '@/components/button.vue';
import vInput from '@/components/editor/input.vue';

import { ref, computed, watch } from 'vue';

import { useApi } from '@/plugins/api';
const api = useApi();

import { useNotifications } from '@/plugins/notifications';
const { setSnackbar } = useNotifications();

const emit = defineEmits(['validId']); 
const props = defineProps({
    button: {
        type: Object,
        required: true
    }
})

const isLoading = ref(false);
const contractId = ref(undefined);
const _editDisabled = ref(false);
const editDisabled = computed(() => {
  return contractId.value === undefined || contractId.value === '' || _editDisabled.value || isLoading.value;
});

const handleClick = () => {
  isLoading.value = true;
  // Call API & wait for the response
  api
    .getContract(contractId.value)
    .then(() => {
      // Don't make it stop loading, otherwise it doesn't look good
      emit('validId', contractId.value);
    })
    .catch(() => {
      isLoading.value = false;
      _editDisabled.value = true;
      setSnackbar("Contract doesn't exist!", 'error', 5);
    });
};
watch(
  () => contractId.value,
  () => {
    // Edit must be disabled because the id is invalid
    if (_editDisabled.value) {
      _editDisabled.value = !_editDisabled.value;
    }
  }
);
</script>
