<template>
  <section>
    <article
      class="challenge-card"
      :class="{
        active: isChallengeCardOpen,
      }"
      @click="selectChallengeCard()"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div
          class="flex flex-col items-center space-x-0 space-y-4 md:space-y-0 md:space-x-4 md:flex-row"
        >
          <div class="h-[60px] w-[60px] rounded-full bg-gray-400">&nbsp;
            <!-- <img
              :src="challenge.avatar"
              alt="Kisiki Capital - Challenge Avatar"
              height="60px"
              width="60px"
            /> -->
          </div>
          <div class="flex flex-col">
            <div>
              <b :title="challenge._id"
                >{{ 'MatchTrader' }}&nbsp;{{
                  challenge._id?.substring(0, 8)
                }}...</b
              >
            </div>
            <div>
              <!-- {{ challenge.challengeLevel }} -->
                {{  'Practitioner' }}
              &nbsp;&bullet;&nbsp;{{
                challenge.accountType?.trim() == 'one-phase-funding' ? 'One Phase' : 'Two Phase'
              }}
            </div>
          </div>
        </div>
        <div class="mt-3 text-center md:mt-0">
          <ChallengeStatusPill :challenge-status="challenge.challengeStatus" />
        </div>
      </div>

      <hr class="my-3 white-20-divider" />
      <div
        class="flex flex-col justify-around space-x-0 space-y-4 md:space-y-0 md:space-x-4 md:flex-row"
      >
        <div
          class="flex flex-row items-center justify-center px-2 py-1 space-x-1 bg-black md:justify-start rounded-2xl"
        >
          <Icon
            name="material-symbols:show-chart-rounded"
            class="w-[20px] h-[20px]"
          />
          <div>
            <span class="text-medium">
              <!-- {{ challenge.tradeQuantity }} -->
                {{ '0' }}
            </span>
            <span class="caption-nrm-faded">&nbsp;Trades</span>
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-center px-2 py-1 space-x-1 bg-black md:justify-start rounded-2xl"
        >
          <Icon
            name="material-symbols:calendar-today-outline-sharp"
            class="w-[20px] h-[20px]"
          />
          <div>
            <span class="text-medium">
              <!-- {{ challenge.daysTraded }} -->
                {{ '0' }}
            </span>
            <span class="caption-nrm-faded">&nbsp;Days traded</span>
          </div>
        </div>
      </div>

      <div v-if="isChallengeCardOpen">
        <hr class="my-3 white-20-divider" />
        <div class="flex flex-row justify-around mt-6 space-x-2">
          <button
            aria-label="Challenge Dashboard"
            class="p-2 rounded btn-dcta"
            @click="openChallengeOverview()"
          >
            Dashboard
          </button>
          <button
            aria-label="Challenge Credentials"
            class="p-2 border rounded btn-ghost"
            @click="toggleCredentialsPopup()"
          >
            Credentials
          </button>
        </div>
      </div>
    </article>
    <CredentialsPopup ref="credentialsPopup" />
  </section>
</template>

<script setup>
import useChallengeListStore from "~/store/modules/challengeListStore";
const challengeListStore = useChallengeListStore()

const props = defineProps({
  challenge: Object,
  challengeIndex: Number,
});
const emit = defineEmits(["openChallengeOverview"]);

function openChallengeOverview() {
  emit("openChallengeOverview");
}

const isChallengeCardOpen = ref(false);
function selectChallengeCard() {
  isChallengeCardOpen.value = !isChallengeCardOpen.value;
  challengeListStore.setActiveChallenge(props.challengeIndex);
}

import { ref } from "vue";
const credentialsPopup = ref(null);
function toggleCredentialsPopup() {
  credentialsPopup.value.toggleCredentialsPopup();
}
</script>

<style scoped>
.challenge-card {
  @apply p-4 my-4;
  border: 1px solid var(--dtertiary);
  cursor: pointer;
}

.challenge-card.active,
.challenge-card:hover {
  border: 1px solid var(--secondary);
}
</style>
