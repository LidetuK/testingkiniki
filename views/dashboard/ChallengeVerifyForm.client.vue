<template>
  <section id="challenge-verify-form" class="p-10">
    <div class="mb-6 text-3xl font-bold">Verify billing</div>
    <form class="mb-8">
      <!-- <article class="my-4">
        <div class="mb-2"><label for="country">Title</label></div>
        <Dropdown
          :list="personTitleList"
          :placeholder="personTitlePlaceholder"
          :is-array-of-objects="true"
          :is-dashboard="true"
          @fillOption="fillOption"
        />
      </article> -->
      <article class="mb-4">
        <div class="mb-2">
          <label for="first name">First Name</label>
        </div>
        <input
          type="text"
          placeholder="Enter your first name"
          v-model="firstName"
          required
        />
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="last name">Last Name</label>
        </div>
        <input
          type="text"
          placeholder="Enter your last name"
          v-model="lastName"
          required
        />
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="city">City</label>
        </div>
        <input
          type="text"
          placeholder="Enter your city"
          v-model="city"
          required
        />
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="street">Street</label>
        </div>
        <input
          type="text"
          placeholder="Enter your street"
          v-model="street"
          required
        />
      </article>
      <article class="mb-4">
        <div class="mb-2">
          <label for="postal code">Postal Code</label>
        </div>
        <input
          type="text"
          placeholder="Enter your postal code"
          v-model="postalCode"
          required
        />
      </article>
      <article class="mb-4">
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
          <label for="date of birth">Date Of Birth</label>
        </div>
        <input type="date" v-model="dateOfBirth" required />
      </article>
      <div class="inline-flex">
        <div class="flex items-center mr-3">
          <input
            id="checkbox"
            type="checkbox"
            class="w-4 h-4 text-yellow-600 bg-yellow-100 border-yellow-300 rounded-full focus:ring-yellow-500"
            v-model="isChallengeLegal"
            required
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
    </form>
    <div>
      <button
        aria-label="Proceed To Pay"
        class="w-full p-4 rounded btn-dcta"
        @click="goToPayForm()"
      >
        Proceed To Pay
      </button>
    </div>
  </section>
</template>

<script setup>
const { notify } = useNotification();
import useNewChallengeStore from "~/store/modules/newChallengeStore";
const newChallengeStore = useNewChallengeStore();

// const personTitleList = ref([
//   {
//     id: "1",
//     content: "Mr.",
//   },
//   {
//     id: "2",
//     content: "Mrs.",
//   },
//   {
//     id: "3",
//     content: "Ms.",
//   },
//   {
//     id: "4",
//     content: "Mx.",
//   },
// ]);
const selectedPersonTitle = ref({
  id: "1",
  content: "Mr.",
});
const firstName = ref(null);
const lastName = ref(null);
const city = ref(null);
const street = ref(null);
const postalCode = ref(null);
const dateOfBirth = ref(null);

const personTitlePlaceholder = ref("Select title");

import countriesListData from "~/data/countriesListData.js";
import useCheckoutStore from "~/store/modules/checkoutStore";
const countriesList = ref(countriesListData);
const selectedCountry = ref(
  newChallengeStore.challengeCheckoutState.country ?? {
    acronym: "TZ",
    content: "Tanzania, United Republic of",
  }
);
const countriesPlaceholder = ref("Select country");

function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == personTitlePlaceholder.value) {
    selectedPersonTitle.value = dropdownEmit.option;
  } else if (dropdownEmit.placeholder == countriesPlaceholder.value) {
    selectedCountry.value = dropdownEmit.option;
  }
}

const isChallengeLegal = ref(false);

function isLegalAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthdate hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

let challengeAccount = null;
const checkoutStore = useCheckoutStore()
function goToPayForm() {
  if (!isChallengeLegal.value) {
    notify({
      title: "Terms & Conditions",
      text: "Please read and accept the terms and conditions!",
    });
    return;
  }
  if (!isLegalAge(dateOfBirth.value)) {
    notify({
      title: "Age limit of 18+",
      text: "Only persons of legal age are allowed to create an account with us.",
    });
    return;
  }

  challengeAccount = {
    firstname: firstName.value,
    lastname: lastName.value,
    city: city.value,
    street: street.value,
    postalCode: postalCode.value,
    country: selectedCountry.value,
    dateOfBirth: dateOfBirth.value,
  };
  newChallengeStore.setChallengeAccount(challengeAccount);

  const { email, purchasePrice, capital, capitalCurrency, itemCategory, purchaseCurrency } = checkoutStore
  checkoutStore.setData({
    email,
    purchasePrice,
    capital,
    capitalCurrency,
    itemCategory,
    purchaseCurrency,
    account: challengeAccount
  })

  storeNewChallenge();
}

// const { createNewChallenge } = useAPIServices();
const emit = defineEmits(["goToPayForm"]);
async function storeNewChallenge() {
  emit("goToPayForm");
  // alert (JSON.stringify(checkoutStore.getData()))
  // const res = await createNewChallenge({
  //   ...newChallengeStore.challengeCheckoutState,
  //   ...challengeAccount.value,
  // });
  // if (res.success) {
  //   console.log("Create New Challenge Success: ", res.data);
  //   emit("goToPayForm");
  // } else if (!res.success) {
  //   console.error("Create New Challenge Failed: ", res.error);
  // }
}
</script>
