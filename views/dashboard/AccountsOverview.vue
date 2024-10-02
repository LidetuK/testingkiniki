<template>
  <section id="accounts-overview" class="m-4">
    <DashboardHeader
      :side-nav-title="'Home'"
      :side-nav-icon="`<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#9F9F9F'><path d='M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z'/></svg>`"
    />
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="col-span-1">
        <form class="mb-8">
          <article class="mb-4">
            <Dropdown
              :list="phasesList"
              :placeholder="phasePlaceholder"
              :is-array-of-objects="true"
              :is-dashboard="true"
              :is-filter="true"
              @fillOption="fillOption"
            />
          </article>
          <article class="my-4">
            <Dropdown
              :list="statusesList"
              :placeholder="statusesPlaceholder"
              :is-array-of-objects="true"
              :is-dashboard="true"
              :is-filter="true"
              @fillOption="fillOption"
            />
          </article>
          <article class="my-4">
            <Dropdown
              :list="levelsList"
              :placeholder="levelsPlaceholder"
              :is-array-of-objects="true"
              :is-dashboard="true"
              :is-filter="true"
              @fillOption="fillOption"
            />
          </article>
          <div>
            <button
              aria-label="Get Started"
              class="w-full p-4 rounded btn-dcta"
              @click="toggleSideNavs()"
            >
              New Challenge
            </button>
          </div>
        </form>
        <hr class="white-40-divider" />
        <div class="mt-8" v-if="challengeAccounts.length > 0">
          <div
            v-for="(challenge, challengeIndex) in challengeAccounts"
            :key="challenge.id"
          >
            <ChallengeCard
              :challenge="challenge"
              :challengeIndex="challengeIndex"
              @openChallengeOverview="openChallengeOverview"
            />
          </div>
        </div>
        <div class="mt-8 w-full h-[250px]" v-else>
          You don't have any challenge account
        </div>
      </div>
      <div class="col-span-1 lg:col-span-2">
        <div class="p-4" id="account-chart">
          <div class="flex flex-col">
            <div class="title-lg">Account Overview</div>
            <div class="title-md">
              {{ accountOverview.challengeNumber }}
            </div>
            <div class="caption-nrm-faded">
              {{ accountOverview.createdAt }}
            </div>
            <div class="mt-8 mb-4"><LineChart :height="580" /></div>
            <hr class="white-40-divider" />
            <div
              class="flex flex-col items-center justify-around mt-4 space-x-0 space-y-4 md:items-start md:space-x-4 md:space-y-0 md:flex-row"
            >
              <div class="flex flex-col">
                <div class="caption-nrm-faded">Account Balance</div>
                <div class="font-bold text-medium">
                  {{ accountOverview.accountBalance }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="caption-nrm-faded">Average Win</div>
                <div class="font-bold text-medium text-green-custom">
                  {{ accountOverview.averageWin }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="caption-nrm-faded">Average Loss</div>
                <div class="font-bold text-medium text-red-custom">
                  {{ accountOverview.averageLoss }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="caption-nrm-faded">Win Ratio</div>
                <div class="font-bold text-medium">
                  {{ accountOverview.winRatio }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["openChallengeOverview"]);
function openChallengeOverview() {
  emit("openChallengeOverview");
}

import useSideNavStore from "~/store/modules/sideNavStore";
const sideNavStore = useSideNavStore();
function toggleSideNavs() {
  sideNavStore.setSideNavId(1);
}

const phasesList = ref([
  {
    id: "0",
    content: "All Phases",
  },
  {
    id: "1",
    content: "One Phase",
  },
  {
    id: "2",
    content: "Two Phase",
  },
]);
const selectedPhase = ref({
  id: "0",
  content: "All Phases",
});
const phasePlaceholder = ref("All Phases");

const statusesList = ref([
  {
    id: "0",
    content: "All Statuses",
  },
  {
    id: "1",
    content: "New",
  },
  {
    id: "2",
    content: "Ongoing",
  },
  {
    id: "3",
    content: "Not Passed",
  },
  {
    id: "4",
    content: "Passed",
  },
]);
const selectedStatus = ref({
  id: "0",
  content: "All Statuses",
});
const statusesPlaceholder = ref("All Statuses");

const levelsList = ref([
  {
    id: "0",
    content: "All Accounts",
  },
  {
    id: "1",
    content: "Student",
  },
  {
    id: "2",
    content: "Practitioner",
  },
  {
    id: "3",
    content: "Master",
  },
]);
const selectedLevel = ref({
  id: "0",
  content: "All Accounts",
});
const levelsPlaceholder = ref("All Accounts");

function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == phasePlaceholder.value) {
    selectedPhase.value = dropdownEmit.option;
  } else if (dropdownEmit.placeholder == statusesPlaceholder.value) {
    selectedStatus.value = dropdownEmit.option;
  } else if (dropdownEmit.placeholder == levelsPlaceholder.value) {
    selectedLevel.value = dropdownEmit.option;
  }
}

import useChallengeListStore from "~/store/modules/challengeListStore";
const challengeListStore = useChallengeListStore();
const challengesList = ref(challengeListStore.challengesListState);
const accountOverview = ref(challengeListStore.activeChallengeState);

const { SERVER_URL } = useRuntimeConfig().public
const challengeAccounts = ref([])
const getChallengesAccounts = async () => {
  const accessToken = localStorage.getItem('feathers-jwt')
  const response = await $fetch(`${SERVER_URL}/challenges`,
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  challengeAccounts.value = response.data;
  if (!response) {
    notify({ title: 'Challenge Accounts', text: 'Failed fetching challenge accounts. Please reload the page.' })
  }
    
}
const { notify } = useNotification()
onMounted(async() => {
  challengeListStore.$subscribe((mutation, state) => {
    accountOverview.value = state.activeChallengeState;
  });

  await getChallengesAccounts()
});
</script>

<style scoped>
.dropdown-select {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.dropdown-option {
  padding: 0.5rem;
}

button .b {
  font-size: var(--font-xl);
}
</style>
