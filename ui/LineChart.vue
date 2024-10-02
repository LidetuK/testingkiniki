<template>
  <div id="line-chart">
    <Line :data="balanceHistoryChart" :options="chartOptions" :height="height" />
  </div>
</template>

<script setup>
import useChallengeListStore from "~/store/modules/challengeListStore";
const challengeListStore = useChallengeListStore();
const balanceHistoryChart = ref(
  challengeListStore.activeChallengeState.balanceHistoryChart
);

const props = defineProps({
  height: {
    type: Number,
    required: false,
  },
});

import { Line } from "vue-chartjs";
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderColor: "#EB652D",
    },
    point: {
      radius: 6,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
});

onMounted(() => {
  challengeListStore.$subscribe((mutation, state) => {
    balanceHistoryChart.value = state.activeChallengeState.balanceHistoryChart;
  });
});
</script>
