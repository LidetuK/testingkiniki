<template>
  <main id="payout-form" class="m-4">
    <DashboardHeader
      :side-nav-title="'Payouts'"
      :side-nav-icon="`<svg xmlns='http://www.w3.org/2000/svg' fill='#9F9F9F' height='24px' viewBox='0 -960 960 960' width='24px'><path d='M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z'/></svg>`"
      :center="true"
    />
   <div class="flex flex-row justify-center" >
      <button
        aria-label="Back to Payouts from Payout Form"
        class="p-2 mb-8 border rounded btn-ghost"
        @click="closePayoutForm()"
      >
        Back
      </button>
   </div>
    <div class="flex flex-col items-center justify-center">
      <section class="flex flex-col justify-center p-4 md:p-10 lg:mx-96">
        <div class="mb-2 title-xl">Request A New Payout</div>
        <div class="caption-faded">
          Use this form to request a new payout, we will verify and get in touch
          with you for further advancements for your trading account
        </div>
        <div class="my-8 payout-rules">
          <b>Note:</b>
          <ul>
            <li>
              ONLY FOR TUESDAY PAYDAY: Payouts can be requested every TUESDAY
              between 09:00 - 19:00 Dubai Time (08:00 - 18:00 according to your
              timezone Africa/Dar_es_Salaam) effective from June 4th, 2024
            </li>
            <li>ALL TRADES MUST BE CLOSED INCLUDING PENDING ORDERS.</li>
            <li>
              Please wait for at least 15 mins after you close your latest trade
              to request a payout.
            </li>
            <li>
              Minimum amount for an eligible payout is 1% of initial balance.
            </li>
            <li>
              Payouts below $500 will be processed via crypto. Payouts above
              $500 will be processed via Rise. Rise supports both bank transfer
              and crypto.
            </li>
            <li>
              If Rise does not support the country, the payout will be processed
              without Rise through crypto.
            </li>
          </ul>
        </div>
        <form>
          <article class="mb-4">
            <div class="mb-2">
              <label for="account type">Account Type</label>
            </div>
            <div
              class="flex flex-row px-4 py-3 space-x-4 rounded-lg btn-dtab-container"
            >
              <div v-for="accountType in accountTypeList" :key="accountType.id">
                <div
                  class="px-4 py-2 rounded-full cursor-pointer btn-dtab"
                  :class="{
                    active: selectedAccountTypeId == accountType.id,
                  }"
                  @click="selectAccountType(accountType)"
                >
                  {{ accountType.title }}
                </div>
              </div>
            </div>
          </article>
          <div>
            <label for="Account Login Ids"
              >Select Account Login Ids <sup>*</sup>
            </label>
            <Dropdown
              :list="accountsList"
              :placeholder="accountsPlaceholder"
              :is-dashboard="true"
              @fillOption="fillOption"
            />
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
const accountTypeList = ref([
  {
    id: "1",
    title: "One Phase",
  },
  {
    id: "2",
    title: "Two Phase",
  },
]);
const selectedAccountTypeId = ref(2);
const isPhaseChosen = ref(false);
function selectAccountType(accountType) {
  selectedAccountTypeId.value = accountType.id;
  isPhaseChosen.value = accountType.id == 1 ? true : false;
}

const accountsList = ref(["131314342", "242545345", "786785765"]);
const accountsPlaceholder = ref("Select Account");
const selectedAccount = ref(null);
function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == accountsPlaceholder.value) {
    selectedAccount.value = dropdownEmit.option;
  }
}

const emit = defineEmits(["closePayoutForm"]);
function closePayoutForm() {
  emit("closePayoutForm");
}
</script>

<style scoped>
.payout-rules {
  color: var(--dsecondary);
}
.payout-rules b,
.payout-rules li {
  @apply py-2;
}

.payout-rules li {
  @apply ml-2;
  list-style-type: disc;
}
</style>
