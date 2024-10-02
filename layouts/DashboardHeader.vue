<template>
  <header
    class="flex flex-row items-center my-4 space-x-2"
    :class="{ 'justify-center': center }"
  >
    <div v-html="sideNavIcon"></div>
    <div>{{ sideNavTitle }}</div>
  </header>
</template>

<script setup>
const props = defineProps({
  sideNavTitle: String,
  sideNavIcon: String,
  center: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style scoped>
header {
  color: var(--dgrey-100);
}

header svg {
  fill: var(--dgrey-100);
}
</style>
