<template>
  <section
    id="challenge-status-pill"
    class="p-1 rounded"
    :class="{
      'bg-green-custom': challengeStatus == 'Passed',
      'bg-red-custom': challengeStatus == 'Not Passed',
      'bg-yellow-custom': challengeStatus == 'Ongoing',
    }"
  >
    {{ challengeStatus }}
  </section>
</template>

<script setup>
const props = defineProps({
  challengeStatus: String,
});
</script>

<style scoped>
#challenge-status-pill {
  font-size: var(--font-nrm);
}
</style>
