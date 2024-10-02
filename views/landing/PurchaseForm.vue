<template>
  <section
    class="flex flex-row items-center justify-center backdrop-filter backdrop-blur-sm popup-box-overlay"
  >
    <main class="px-8 py-6 popup-box">
      <article class="flex flex-row items-center justify-between">
        <div>
          <article class="flex flex-row items-center space-x-2">
            <img
              src="/img/logos/logo-mark.webp"
              alt="Kisiki Capital Logo Mark"
              width="40"
              height="40"
            />
            <div class="font-bold">Kisiki Capital</div>
          </article>
        </div>
        <button class="btn-close" @click="togglePurchaseForm()">&times;</button>
      </article>
      <article class="hidden mb-4 text-left md:block">
        <div class="mb-2 title-xl">Purchase Package</div>
        <div class="caption-faded">
          Enter your email and select a currency to begin the checkout process.
        </div>
      </article>
      <hr class="white-40-divider" />
      <article
        class="flex flex-col justify-between my-2 md:mt-4 md:mb-4 md:flex-row"
      >
        <div class="mb-2 text-left md:mb-0">
          <div class="font-bold md:mb-2 caption-nrm-faded">Package Name</div>
          <div class="font-bold caption-lg">
            {{
              phaseChosen == 1
                ? "One Phase Funding"
                : phaseChosen == 2
                ? "Two Phase Funding"
                : phaseChosen == 3
                ? "Instant Funding"
                : ""
            }}
          </div>
        </div>
        <div class="text-left">
          <div class="font-bold md:mb-2 caption-nrm-faded">Package Cost</div>
          <div class="font-bold caption-lg">USD {{ purchasePrice }}</div>
        </div>
      </article>
      <hr class="white-40-divider" />
      <div
        v-if="showErrorToast"
        class="fixed inset-x-0 top-0 z-50 w-full p-4 mx-auto font-bold text-white bg-red-800 rounded md:max-w-md"
      >
        {{ errorMessage }}
      </div>
      <form id="purchase-form" class="mt-4 text-left">
        <div class="mb-4">
          <div class="mb-2"><label for="email">Email</label></div>
          <input type="email" placeholder="Enter your email" v-model="email" />
        </div>
        <div class="mb-4">
          <div class="mb-2"><label for="currency">Currency</label></div>
          <Dropdown
            :list="currencyList"
            :placeholder="currencyPlaceholder"
            @fillOption="fillOption"
          />
        </div>
        <div class="mb-4" v-show="purchaseCurrency == 'Crypto'">
          <CryptoCurrencySelectMenu @cryptoSelected="handleCryptoSelection" />
        </div>
        <div class="inline-flex mb-4">
          <div class="flex items-center mr-3">
            <input
              id="checkbox"
              type="checkbox"
              class="w-4 h-4 text-yellow-600 bg-yellow-100 border-yellow-300 rounded-full focus:ring-yellow-500"
              v-model="isPurchaseLegal"
            />
          </div>
          <div>
            I agree with the
            <span class="terms-link">
              <NuxtLink to="/terms-and-conditions">
                terms and conditions of operations
              </NuxtLink>
            </span>
          </div>
        </div>
        <div>
          <button
            aria-label="Proceed To Checkout"
            class="p-4 rounded btn-purchase"
            type="submit"
            @click.prevent="proceedToCheckout()"
          >
            Proceed to Checkout
          </button>
        </div>
      </form>
    </main>
  </section>
</template>

<script setup>
const props = defineProps({
  purchasePrice: Number,
  phaseChosen: Number,
  capital: String,
});

const emit = defineEmits(["togglePurchaseForm"]);
function togglePurchaseForm() {
  emit("togglePurchaseForm");
}

import currencyListData from "~/data/currencyListData.js";
const currencyList = ref(currencyListData);
const currencyPlaceholder = ref("Select currency");
const purchaseCurrency = ref(null);
function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == currencyPlaceholder.value) {
    purchaseCurrency.value = dropdownEmit.option;
  }
}

const email = ref("");
const isPurchaseLegal = ref(false);
const showErrorToast = ref(false);
const errorMessage = ref("");
function proceedToCheckout() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value) || !purchaseCurrency.value) {
    errorMessage.value = "Please enter a valid email address & currency";
    showErrorToast.value = true;
  } else if (!isPurchaseLegal.value) {
    errorMessage.value =
      "You must agree to the terms and conditions to continue";
    showErrorToast.value = true;
  } else if (purchaseCurrency.value == "Crypto") {
    errorMessage.value = "You must select a crypto currency before procedding";
    showErrorToast.value = true;
  } else {
    errorMessage.value = "";
    showErrorToast.value = false;
    navigateToCheckout();
  }
}

import { navigateTo } from "nuxt/app";
import useCheckoutStore from "~/store/modules/checkoutStore";
const checkoutStore = useCheckoutStore();
async function navigateToCheckout() {
  const searchQuery = ref({
    email: email.value,
    purchasePrice: props.purchasePrice,
    purchaseCurrency: purchaseCurrency.value || "USD",
    capital: parseInt(props.capital.replace(",", "")),
    capitalCurrency: "USD",
    itemCategory: matchPhaseTitle(props.phaseChosen),
  });
  checkoutStore.setData(searchQuery.value);
  await navigateTo({
    path: "/checkout",
    // query: searchQuery.value,
  });
}

const handleCryptoSelection = (selection) => {
  purchaseCurrency.value = selection.currency;
};

import { databasePhaseTitlesData  } from "~/data/phasesData.js";
const databasePhaseTitles = ref(databasePhaseTitlesData);
function matchPhaseTitle(title) {
  return title == 1
    ? databasePhaseTitles.value.onePhase
    : title == 2
    ? databasePhaseTitles.value.twoPhase
    : title == 3
    ? databasePhaseTitles.value.instantFunded
    : "";
}
</script>

<style scoped></style>
