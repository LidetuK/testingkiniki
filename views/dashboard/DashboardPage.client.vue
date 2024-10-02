<template>
  <main id="dashboard-page" class="min-h-screen">
    <div
      v-if="loading"
      class="flex items-center justify-center w-screen h-screen overflow-x-hidden"
    >
      <Icon
        name="eos-icons:three-dots-loading"
        size="96"
        class="text-[--primary]"
      />
    </div>
    <section class="md:flex-row md:flex">
      <div class="md:w-1/6">&nbsp;</div>
      <SideNav />
      <main class="md:w-5/6">
        <section v-if="activeSideNavId == 1">
          <NewChallenge />
        </section>

        <section v-if="activeSideNavId == 2">
          <div v-show="!showChallengeOverview">
            <AccountsOverview @openChallengeOverview="openChallengeOverview" />
          </div>
          <div v-show="showChallengeOverview">
            <ChallengeOverview
              @closeChallengeOverview="closeChallengeOverview"
            />
          </div>
        </section>

        <section v-if="activeSideNavId == 3">
          <div v-show="!showPayoutForm">
            <PayoutsTable @openPayoutForm="openPayoutForm" />
          </div>
          <div v-show="showPayoutForm">
            <PayoutForm @closePayoutForm="closePayoutForm" />
          </div>
        </section>
      </main>
    </section>
  </main>
</template>

<script setup>
import feathersClient from "./../../lib/feathersRestClient";
const { externalApiUrl } = useRuntimeConfig().public;
const feathers = feathersClient(externalApiUrl);

const showChallengeOverview = ref(false);
function openChallengeOverview() {
  showChallengeOverview.value = true;
}
function closeChallengeOverview() {
  showChallengeOverview.value = false;
}

const showPayoutForm = ref(false);
function openPayoutForm() {
  showPayoutForm.value = true;
}
function closePayoutForm() {
  showPayoutForm.value = false;
}

const loading = ref(false);
const reAuthenticate = async () => {
  try {
    await feathers.reAuthenticate();
  } catch (err) {
    navigateTo("/login");
  } finally {
    loading.value = false;
  }
};

import useSideNavStore from "~/store/modules/sideNavStore";
const sideNavStore = useSideNavStore();
const activeSideNavId = ref(sideNavStore.activeSideNavIdState);

onMounted(() => {
  sideNavStore.$subscribe((mutation, state) => {
    activeSideNavId.value = state.activeSideNavIdState;
  });
});

onMounted(async () => {
  loading.value = true;
  setTimeout(() => reAuthenticate(), 3000);
});
</script>

<style scoped></style>
