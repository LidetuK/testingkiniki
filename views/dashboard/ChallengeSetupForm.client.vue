<template>
  <section id="challenge-setup-form" class="p-4 md:p-10">
    <div class="mb-2 text-3xl font-bold">Set up package</div>
    <form class="mb-8">
      <article class="my-4">
        <div class="mb-2"><label for="country">Country</label></div>
        <Dropdown
          :list="countriesList"
          :placeholder="countriesPlaceholder"
          :is-array-of-objects="true"
          :is-dashboard="true"
          @fillOption="fillOption"
        />
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="account type">Account Type</label>
        </div>
        <div
          class="flex flex-row px-4 py-3 space-x-4 rounded-lg btn-dtab-container"
        >
          <div v-for="accountType in accountTypeList" :key="accountType.id">
            <div
              class="px-4 py-2 rounded-full btn-dtab text-center"
              :class="{
                active: phaseChosen == accountType.id,
              }"
              @click="selectAccountType(accountType)"
            >
              {{ accountType.title }}
            </div>
          </div>
        </div>
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="account size">Account Size</label>
        </div>
        <div
          class="flex-row hidden px-4 py-3 space-x-4 rounded-lg btn-dtab-container md:flex"
        >
          <div v-for="accountSize in accountSizeList" :key="accountSize.id">
            <div
              class="px-4 py-2 rounded-full btn-dtab"
              :class="{
                active: selectedAccountSize.id == accountSize.id,
              }"
              @click="selectAccountSize(accountSize)"
            >
              {{ accountSize.content }}
            </div>
          </div>
        </div>
        <div class="md:hidden">
          <Dropdown
            :list="accountSizeList"
            :placeholder="accountSizePlaceholder"
            :is-array-of-objects="true"
            :is-dashboard="true"
            @fillOption="fillOption"
          />
        </div>
      </article>
      <div class="inline-flex mb-4">
        <div class="flex items-center mr-3">
          <input
            id="checkbox"
            type="checkbox"
            class="w-4 h-4 text-yellow-600 bg-yellow-100 border-yellow-300 rounded-full focus:ring-yellow-500"
            v-model="isNotResidentOrCitizenOfTheUS"
          />
        </div>
        <b>I am not a US resident or citizen.</b>
      </div>
    </form>
    <hr class="setup-thick-divider" />

    <div>
      <div
        class="flex flex-col-reverse items-start justify-between md:flex-row"
      >
        <article class="flex flex-col justify-between my-6 space-y-4">
          <div>
            <div class="mb-2 font-bold caption-nrm-faded">Account Type</div>
            <div class="font-bold text-2xl">
              <span v-show="phaseChosen == 1">One Phase</span>
              <span v-show="phaseChosen == 2">Two Phase</span>
              <span v-show="phaseChosen == 3">Instant Funded</span>
            </div>
          </div>
          <div>
            <div class="mb-2 font-bold caption-nrm-faded">Country</div>
            <div class="font-bold text-2xl">
              {{ selectedCountry.acronym }}
            </div>
          </div>
          <div>
            <div class="mb-2 font-bold caption-nrm-faded">Platform</div>
            <div class="inline-flex items-center space-x-2">
              <span class="font-bold text-2xl">Match Trader</span>
              <span>
                <img
                  src="/img/icons/match-trader.webp"
                  alt="Kisiki Capital - Match Trader"
                  width="50"
                />
              </span>
            </div>
          </div>
        </article>
        <article class="flex flex-col justify-between my-6 space-y-4">
          <div>
            <div class="mb-2 font-bold caption-nrm-faded">Account Size</div>
            <div class="font-bold text-[--dprimary] text-2xl">
              USD {{ selectedAccountSize.content }}
            </div>
          </div>
          <div>
            <div class="mb-2 font-bold caption-nrm-faded">Package Cost</div>
            <div class="font-bold text-[--dprimary] text-2xl">
              USD
              {{
                phaseChosen == 1
                  ? selectedAccountSize.phaseOnePrice
                  : phaseChosen == 2
                  ? selectedAccountSize.phaseTwoPrice
                  : phaseChosen == 3
                  ? selectedAccountSize.instantFundedPrice
                  : ""
              }}
            </div>
          </div>
        </article>
      </div>
      <hr class="setup-thin-divider" />
      <PhaseTable :phase-chosen="Number(phaseChosen)" />
      <hr class="setup-thick-divider" />
    </div>
    <div class="mt-10">
      <button
        aria-label="Choose Package"
        class="w-full p-4 rounded btn-dcta"
        @click.prevent="goToVerifyForm()"
      >
        Choose Package
      </button>
    </div>
  </section>
</template>

<script setup>
import { accountTitlesData, accountSizeListData } from "~/data/phasesData.js";
const { notify } = useNotification();

import countriesListData from "~/data/countriesListData.js";
const countriesList = ref(countriesListData);
const selectedCountry = ref({
  acronym: "TZ",
  content: "Tanzania, United Republic of",
});
const countriesPlaceholder = ref("Select country");

const accountTitles = ref(accountTitlesData);
const accountTypeList = ref([
  {
    id: "1",
    title: accountTitles.value.onePhase,
  },
  {
    id: "2",
    title: accountTitles.value.twoPhase,
  },
  {
    id: "3",
    title: accountTitles.value.instantFunded,
  },
]);
const phaseChosen = ref(2);
function selectAccountType(accountType) {
  phaseChosen.value = accountType.id;
}

const accountSizeList = ref(accountSizeListData);
const selectedAccountSize = ref(
  accountSizeListData[accountSizeListData.length - 1]
);
function selectAccountSize(accountSize) {
  selectedAccountSize.value = accountSize;
}
const accountSizePlaceholder = ref("Select account size");

function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == countriesPlaceholder.value) {
    selectedCountry.value = dropdownEmit.option;
  } else if (dropdownEmit.placeholder == accountSizePlaceholder.value) {
    selectedAccountSize.value = dropdownEmit.option;
  }
}

const isNotResidentOrCitizenOfTheUS = ref(false);

const extractAccountTypeTitle = (selectedId) => {
  const accountType = accountTypeList.value.filter((accountType) => {
    return accountType.id == selectedId;
  });
  return accountType[0];
};
const extractPackageCost = (accountType, selectedAccountSize) => {
  if (accountType.title == accountTitles.value.onePhase) {
    return parseFloat(selectedAccountSize.phaseOnePrice?.replace(",", ""));
  } else if (accountType.title == accountTitles.value.twoPhase) {
    return parseFloat(selectedAccountSize.phaseTwoPrice?.replace(",", ""));
  } else if (accountType.title == accountTitles.value.instantFunded) {
    return parseFloat(selectedAccountSize.instantFundedPrice?.replace(",", ""));
  } else {
    return null;
  }
};

import useCheckoutStore from "~/store/modules/checkoutStore";
import useNewChallengeStore from "~/store/modules/newChallengeStore";
const newChallengeStore = useNewChallengeStore();
const emit = defineEmits(["goToVerifyForm"]);
async function goToVerifyForm() {
  if (!isNotResidentOrCitizenOfTheUS.value) {
    notify({
      title: "US citizens not allowed",
      text: "citizens or residents from the US are barred from creating an account with us",
    });
    return;
  }
  const accountType = extractAccountTypeTitle(phaseChosen.value);
  newChallengeStore.setChallengeCheckout({
    country: selectedCountry.value,
    accountType,
    isNotResidentOrCitizenOfTheUS: isNotResidentOrCitizenOfTheUS.value,
    accountSize: parseFloat(selectedAccountSize.value.content.replace(",", "")),
    packageCost: extractPackageCost(accountType, selectedAccountSize.value),
    platform: "Match Trader",
  });

  const checkoutStore = useCheckoutStore();
  const user = await getUser();
  checkoutStore.setData({
    email: user.email,
    purchasePrice: extractPackageCost(accountType, selectedAccountSize.value),
    purchaseCurrency: null,
    capital: parseFloat(selectedAccountSize.value.content.replace(",", "")),
    capitalCurrency: "USD",
    itemCategory: accountType.title,
    account: null,
  });

  emit("goToVerifyForm");
}

import feathersClient from "~/lib/feathersRestClient";
const { externalApiUrl } = useRuntimeConfig().public;
const feathers = feathersClient(externalApiUrl);
async function getUser() {
  try {
    const response = await feathers.reAuthenticate();
    return response.user;
  } catch (err) {
    notify({
      title: "Authentication Error",
      text: "Could not authenticate user",
    });
  }
}
</script>

<style scoped>
.setup-thin-divider {
  border: 1px solid var(--white-40);
}

.setup-thick-divider {
  border: 2.5px solid var(--white-70);
}
</style>
