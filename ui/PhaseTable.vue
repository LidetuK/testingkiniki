<template>
  <div class="mt-8 mb-8 phase-table">
    <table class="w-full text-left table-auto">
      <thead>
        <tr>
          <th></th>
          <th v-show="phaseChosen == 1 || phaseChosen == 2">Phase One</th>
          <th v-show="phaseChosen == 2">Phase Two</th>
          <th v-show="phaseChosen == 3">Instant Funded</th>
          <th v-show="phaseChosen == 1 || phaseChosen == 2">
            <span>Funding</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Profit Target</td>
          <td v-show="phaseChosen == 1"><span>8%</span></td>
          <td v-show="phaseChosen == 1"><span>-</span></td>

          <td v-show="phaseChosen == 2"><span>8%</span></td>
          <td v-show="phaseChosen == 2"><span>5%</span></td>
          <td v-show="phaseChosen == 2"><span>-</span></td>

          <td v-show="phaseChosen == 3"><span>-</span></td>
        </tr>
        <tr>
          <td>Max Daily Loss</td>
          <td v-show="phaseChosen == 1"><span>5%</span></td>
          <td v-show="phaseChosen == 1"><span>5%</span></td>

          <td v-show="phaseChosen == 2"><span>5%</span></td>
          <td v-show="phaseChosen == 2"><span>5%</span></td>
          <td v-show="phaseChosen == 2"><span>5%</span></td>

          <td v-show="phaseChosen == 3"><span>-</span></td>
        </tr>
        <tr>
          <td>Max Loss</td>
          <td v-show="phaseChosen == 1"><span>10%</span></td>
          <td v-show="phaseChosen == 1"><span>10%</span></td>

          <td v-show="phaseChosen == 2"><span>10%</span></td>
          <td v-show="phaseChosen == 2"><span>10%</span></td>
          <td v-show="phaseChosen == 2"><span>10%</span></td>

          <td v-show="phaseChosen == 3"><span>10%</span></td>
        </tr>
        <tr>
          <td>Profit Split</td>
          <td v-show="phaseChosen == 1"><span>-</span></td>
          <td v-show="phaseChosen == 1"><span>up to 1000% </span></td>

          <td v-show="phaseChosen == 2"><span>-</span></td>
          <td v-show="phaseChosen == 2"><span>-</span></td>
          <td v-show="phaseChosen == 2"><span>- 90%</span></td>

          <td v-show="phaseChosen == 3"><span>70%</span></td>
        </tr>
        <tr v-show="phaseChosen == 1 || phaseChosen == 2">
          <td>EA Trading</td>
          <td v-show="phaseChosen == 1"><span>Yes</span></td>
          <td v-show="phaseChosen == 1"><span>Yes</span></td>

          <td v-show="phaseChosen == 2"><span>-</span></td>
          <td v-show="phaseChosen == 2"><span>-</span></td>
          <td v-show="phaseChosen == 2"><span>-</span></td>
        </tr>
        <tr>
          <td>Trading Period</td>
          <td v-show="phaseChosen == 1"><span>Unlimited</span></td>
          <td v-show="phaseChosen == 1"><span>Unlimited</span></td>

          <td v-show="phaseChosen == 2"><span>Unlimited</span></td>
          <td v-show="phaseChosen == 2"><span>Unlimited</span></td>
          <td v-show="phaseChosen == 2"><span>Unlimited</span></td>

          <td v-show="phaseChosen == 3">
            <span>Weekdays</span>
          </td>
        </tr>
        <tr v-show="phaseChosen == 2">
          <td>Fees Refund</td>
          <td><span>-</span></td>
          <td><span>-</span></td>
          <td><span>Yes</span></td>
        </tr>
        <tr v-show="phaseChosen == 3">
          <td>Scale Target</td>
          <td><span>10%</span></td>
        </tr>
        <tr v-show="phaseChosen == 3">
          <td>Scaling speed</td>
          <td><span>Account size doubles each time you scale</span></td>
        </tr>
        <tr v-show="phaseChosen == 3">
          <td>Leverage - Currencies</td>
          <td><span>1:100</span></td>
        </tr>
        <tr v-show="phaseChosen == 3">
          <td>Leverage - Commodities</td>
          <td><span>1:20</span></td>
        </tr>
        <tr v-show="phaseChosen == 3">
          <td>Payouts</td>
          <td>
            <span> 14 days after your first trade and weekly after that </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  phaseChosen: Number,
});
</script>

<style scoped></style>
