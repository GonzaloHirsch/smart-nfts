<template>
  <transition name="rise">
    <div
      v-if="snackbarContent.text"
      :class="[
        snackbarContent.text ? '-translate-y-6' : '',
        'mx-auto max-w-lg fixed bottom-0 left-0 right-0 shadow-md text-center py-2 pl-2 pr-8 rounded-md overflow-hidden w-max z-50',
        classes.parent
      ]"
    >
      <span>{{ snackbarContent.text }}</span>
      <XIcon :class="['absolute h-6 w-6 top-0 right-0 cursor-pointer transition duration-300', classes.icon]" @click="handleCloseSnackbar" />
      <div v-if="snackbarContent.timeout" :class="['w-full h-2 flex flex-row justify-end mt-2 rounded-sm', classes.timeoutOuter]">
        <div :class="['rounded-sm', classes.timeoutInner]" :style="{ width: timerWidth }" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XIcon } from '@heroicons/vue/solid';

import { useNotifications } from '@/plugins/notifications';
const { snackbarContent, clearSnackbar } = useNotifications();
import { watch, ref, computed } from 'vue';

const timeout = ref(null);
const interval = ref(null);
const count = ref(0);
const limit = ref(100);
const timerWidth = ref(null);
const timerInterval = 20;
const updateTimer = () => {
  count.value++;
  timerWidth.value = Math.ceil((count.value / limit.value) * 100) + '%';
};
const clearTimers = () => {
  if (timeout.value) clearTimeout(timeout.value);
  if (interval.value) clearInterval(interval.value);
  timeout.value = null;
  interval.value = null;
  count.value = 0;
};
const handleCloseSnackbar = () => {
  clearTimers();
  clearSnackbar();
};
const createTimer = () => {
  count.value = 0;
  timeout.value = setTimeout(handleCloseSnackbar, snackbarContent.value.timeout * 1000);
  limit.value = (snackbarContent.value.timeout * 1000) / timerInterval;
  // Create the timer
  interval.value = setInterval(() => {
    // Update the interval variables each time it counts
    updateTimer();
  }, timerInterval);
};
watch(
  () => snackbarContent.value.timeout,
  () => {
    clearTimers();
    createTimer();
  }
);
watch(
  () => snackbarContent.value.text,
  () => {
    clearTimers();
    if (snackbarContent.value.timeout) createTimer();
  }
);

// Classes
const classes = computed(() => {
  if (snackbarContent.value.format) {
    switch (snackbarContent.value.format) {
      case 'default':
        return {
          parent: 'text-white bg-gray-900',
          icon: 'hover:text-red-500',
          timeoutOuter: 'bg-gray-400 bg-opacity-50',
          timeoutInner: 'bg-blue-700'
        };
      case 'error':
        return {
          parent: 'text-white bg-red-500',
          icon: 'hover:text-gray-900',
          timeoutOuter: 'bg-gray-400 bg-opacity-50',
          timeoutInner: 'bg-white'
        };
    }
  }
});
</script>

<style scoped>
.rise-enter-active,
.rise-leave-active {
  transition: transform 0.5s ease-out;
}

.rise-enter-from,
.rise-leave-to {
  transform: translateY(100%);
}

.rise-enter-to,
.rise-leave-from {
  transform: translateY(-1.5rem);
}
</style>
