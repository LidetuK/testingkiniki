<template>
  <div class="p-4 text-left details-container rounded-2xl">
    <div class="flex flex-row justify-between py-4" @click="toggleDetails">
      <span class="font-bold"> {{ details.question }} </span>
      <span class="arrow" :class="{ up: isDetailsOpen }">
        <img
          src="/img/icons/arrow.webp"
          alt="Kisiki Capital"
          height="24"
          width="24"
        />
      </span>
    </div>
    <aside v-if="isDetailsOpen">
      {{ details.answer }}
    </aside>
  </div>
</template>

<script setup>
const props = defineProps({
  details: Object,
});
const isDetailsOpen = ref(false);
function toggleDetails() {
  isDetailsOpen.value = !isDetailsOpen.value;
}
</script>

<style scoped>
.details-container {
  background-image: var(--gradient3);
}

.details-container:hover {
  background-image: var(--gradient2);
}

.details-container aside {
  color: var(--white-70);
}
</style>
