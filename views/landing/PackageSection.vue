<template>
  <main>
    <article class="mb-6 title-lg">Our Packages</article>
    <article>
      Each tier has been carefully crafted to enable you to get the most with
      funds <br />
      within your reach
    </article>
    <article class="hidden mt-8 md:block">
      <div class="px-56 range-labels">
        <div class="flex flex-row justify-center space-x-8">
          <span v-for="amount in phaseAmounts">
            <div>
              {{ amount }}
            </div>
          </span>
        </div>
      </div>
      <input
        type="range"
        class="slider"
        :min="sliderSteps"
        :max="sliderSteps * phaseAmounts.length"
        :step="sliderSteps"
        v-model="sliderValue"
        @change="selectPurchasePriceForSlider()"
      />
    </article>
    <article class="my-8 md:hidden">
      <Dropdown
        :list="phaseAmounts"
        :placeholder="packagePlaceholder"
        @fillOption="fillOption"
      />
    </article>

    <article class="flex justify-center">
      <div
        class="flex flex-row px-4 py-3 mt-4 space-x-4 rounded-full btn-tab-container"
      >
        <button
          class="px-4 py-2 rounded-full btn-tab"
          :class="{ active: phaseChosen == 1 }"
        >
          <span class="hidden md:block" @click="togglePhaseChosen(1, true)">
            One Phase
          </span>
          <span class="md:hidden" @click="togglePhaseChosen(1, false)">
            One Phase
          </span>
        </button>
        <button
          class="px-4 py-2 rounded-full btn-tab"
          :class="{ active: phaseChosen == 2 }"
        >
          <span class="hidden md:block" @click="togglePhaseChosen(2, true)">
            Two Phase
          </span>
          <span class="md:hidden" @click="togglePhaseChosen(2, false)">
            Two Phase
          </span>
        </button>
        <button
          class="px-4 py-2 rounded-full btn-tab"
          :class="{ active: phaseChosen == 3 }"
        >
          <span class="hidden md:block" @click="togglePhaseChosen(3, true)">
            Instant Funded
          </span>
          <span class="md:hidden" @click="togglePhaseChosen(3, false)">
            Instant Funded
          </span>
        </button>
      </div>
    </article>
    <article
      class="flex items-center justify-center mt-8 overflow-x-hidden rounded-lg"
    >
      <div class="px-0 py-8 rounded-lg md:p-8 pricing-box">
        <div
          class="flex flex-col justify-between mb-8 space-x-0 md:space-x-32 md:flex-row"
        >
          <div class="mb-6 text-center md:text-left md:mb-0">
            <div class="font-bold caption-lg">
              <span v-show="phaseChosen == 1">One Phase Pricing</span>
              <span v-show="phaseChosen == 2">Two Phase Pricing</span>
              <span v-show="phaseChosen == 3">Instant Funded Pricing</span>
            </div>
            <div>
              For experienced traders looking to meet <br />
              their targets in one shot
            </div>
          </div>
          <div class="text-center md:text-left">
            <div class="mb-2 font-bold caption-nrm-faded">Amount Deposited</div>
            <div class="font-bold caption-lg-colored">USD {{ capital }}</div>
          </div>
        </div>
        <hr class="white-10-divider" />
        <PhaseTable :phase-chosen="Number(phaseChosen)" />
        <hr class="white-10-divider" />
        <div class="mt-8 mb-8">
          <div
            class="flex flex-col items-center justify-between p-6 md:flex-row rounded-2xl pricing-cta-cover"
          >
            <div class="mb-4 text-left md:mb-0">
              <div class="font-bold caption-nrm-faded">Cost of Package</div>
              <div class="font-bold caption-lg">USD {{ purchasePrice }}</div>
            </div>
            <div>
              <button
                aria-label="Buy Package"
                class="p-4 rounded btn-cta"
                @click="togglePurchaseForm()"
              >
                Buy Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
    <div v-if="isPurchaseForm">
      <PurchaseForm
        :purchase-price="Number(purchasePrice)"
        :phase-chosen="phaseChosen"
        :capital="capital"
        @togglePurchaseForm="togglePurchaseForm"
      />
    </div>
  </main>
</template>

<script setup>
import {
  phaseAmountsData,
  purchasePriceListData,
  sliderStepsData,
} from "~/data/phasesData.js";
const phaseAmounts = ref(phaseAmountsData);
const purchasePriceList = ref(purchasePriceListData);
const sliderSteps = ref(sliderStepsData);
const sliderValue = ref(sliderStepsData);

const phaseChosen = ref(1);
function togglePhaseChosen(phase, isDesktop) {
  phaseChosen.value = phase;
  isDesktop ? selectPurchasePriceForSlider() : selectPurchasePriceForDropdown();
}

const purchasePrice = ref(95);
const capital = ref("10,000");
function selectPurchasePriceForSlider() {
  if (sliderValue.value != 0) {
    purchasePrice.value =
      phaseChosen.value == 1
        ? purchasePriceList.value.phaseOne[
            sliderValue.value / sliderSteps.value - 1
          ]
        : phaseChosen.value == 2
        ? purchasePriceList.value.phaseTwo[
            sliderValue.value / sliderSteps.value - 1
          ]
        : phaseChosen.value == 3
        ? purchasePriceList.value.instantFunded[
            sliderValue.value / sliderSteps.value - 1
          ]
        : [];
  }
  capital.value = phaseAmounts.value[sliderValue.value / sliderSteps.value - 1];
}
const packagePlaceholder = ref("Select Amount");

const dropdownEmitOption = ref("10,000");
const dropdownEmitOptionIndex = ref(0);
function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == packagePlaceholder.value) {
    dropdownEmitOption.value = dropdownEmit.option;
    dropdownEmitOptionIndex.value = dropdownEmit.optionIndex;
    selectPurchasePriceForDropdown();
  }
}

function selectPurchasePriceForDropdown() {
  purchasePrice.value =
    phaseChosen.value == 1
      ? purchasePriceList.value.phaseOne[dropdownEmitOptionIndex.value]
      : phaseChosen.value == 2
      ? purchasePriceList.value.phaseTwo[dropdownEmitOptionIndex.value]
      : phaseChosen.value == 3
      ? purchasePriceList.value.instantFunded[dropdownEmitOptionIndex.value]
      : 0;
  capital.value = dropdownEmitOption.value;
}

const isPurchaseForm = ref(false);
function togglePurchaseForm() {
  isPurchaseForm.value = !isPurchaseForm.value;
}
</script>

<style scoped>
.slider {
  width: 550px;
}

.range-labels {
  font-weight: bold;
  font-size: var(--font-nrm);
}

.btn-purchase {
  @apply py-6 px-4;
  width: 100%;
}
</style>
