<template>
  <div class="overflow-x-auto overflow-y-auto code-viewer justify-start items-start rounded-md bg-slate-800 text-white">
    <pre><code ref="contractCode" class="language-solidity">{{props.code}}</code></pre>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  code: {
    type: String,
    default: undefined
  }
});

// Ref to access the element
const contractCode = ref(null);
// Watch for changes and style again
watch(
  () => props.code,
  async () => {
    // We need to wait for next tick so that it's done loading
    await nextTick();
    if (props.code && contractCode.value) {
      hljs.highlightElement(contractCode.value);
    }
  }
);
</script>

<style scoped>
.code-viewer {
  max-height: 100vh;
}
</style>
