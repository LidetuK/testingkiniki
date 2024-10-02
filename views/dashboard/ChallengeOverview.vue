<template>
  <section id="challenge-overview" class="m-4">
    <DashboardHeader
      :side-nav-title="'Account'"
      :side-nav-icon="`<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#9F9F9F'><path d='M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z'/></svg>`"
    />
    <button
      aria-label="Back to Payouts from Payout Form"
      class="p-2 mb-8 border rounded btn-ghost"
      @click="closeChallengeOverview()"
    >
      Back
    </button>
    <header
      class="flex flex-col justify-between p-4 space-y-6 md:items-center md:flex-row md:space-y-0"
    >
      <div
        class="flex flex-col space-x-0 space-y-2 md:items-center md:space-y-0 md:space-x-3 md:flex-row"
      >
        <div>
          <img
            :src="activeChallenge.challengeOverview.avatar"
            alt="Kisiki Capital - Challenge Avatar"
            height="60"
            width="60"
          />
        </div>
        <div class="flex flex-col space-y-2 md:space-y-0">
          <div
            class="flex flex-col space-x-0 space-y-2 md:items-center md:space-x-6 md:space-y-0 md:flex-row"
          >
            <div class="title-lg">
              {{ activeChallenge.challengeOverview.challengeNumber }}
            </div>
            <div>
              <ChallengeStatusPill
                :challenge-status="
                  activeChallenge.challengeOverview.challengeStatus
                "
              />
            </div>
          </div>
          <div class="caption-nrm-faded">
            Created At: {{ activeChallenge.challengeOverview.createdAt }}
          </div>
        </div>
      </div>
      <button
        aria-label="Challenge Credentials"
        class="p-2 border rounded btn-ghost"
        @click="toggleCredentialsPopup()"
      >
        Credentials
      </button>
    </header>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <main class="col-span-1 lg:col-span-2">
        <div id="challenge-chart" class="p-4">
          <div class="flex flex-col justify-between md:flex-row">
            <div class="mb-2 font-bold md:mb-0 text-medium">
              Account Balance
            </div>
            <div class="flex flex-col space-y-1">
              <div class="font-bold text-medium">
                {{ activeChallenge.challengeOverview.accountBalance.amount }}
              </div>
              <div class="caption-nrm-faded">
                Equity:
                {{ activeChallenge.challengeOverview.accountBalance.equity }}
              </div>
              <div class="caption-nrm-faded">
                <span>Profit:&nbsp;</span>
                <span
                  :class="{
                    'text-green-custom':
                      activeChallenge.challengeOverview.accountBalance.profit >
                      0,
                    'text-red-custom':
                      activeChallenge.challengeOverview.accountBalance.profit <
                      0,
                    'text-yellow-custom':
                      activeChallenge.challengeOverview.accountBalance.profit ==
                      0,
                  }"
                >
                  {{
                    Math.abs(
                      activeChallenge.challengeOverview.accountBalance.profit
                    )
                  }}%
                </span>
                <span
                  class="text-green-custom"
                  v-if="
                    activeChallenge.challengeOverview.accountBalance.profit > 0
                  "
                >
                  <Icon
                    name="material-symbols:arrow-upward-rounded"
                    class="w-[20px] h-[20px]"
                  />
                </span>
                <span
                  class="text-red-custom"
                  v-if="
                    activeChallenge.challengeOverview.accountBalance.profit < 0
                  "
                >
                  <Icon
                    name="material-symbols:arrow-downward-rounded"
                    class="w-[20px] h-[20px]"
                  />
                </span>
                <span
                  class="text-yellow-custom"
                  v-if="
                    activeChallenge.challengeOverview.accountBalance.profit == 0
                  "
                >
                  <Icon
                    name="material-symbols:balance-rounded"
                    class="w-[20px] h-[20px]"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="mt-8 mb-4"><LineChart /></div>
        </div>
      </main>
      <aside class="col-span-1 p-4">
        <div class="flex flex-col space-y-4">
          <div
            v-for="account in activeChallenge.challengeOverview.accountOverview"
            :key="account.title"
          >
            <div class="flex flex-row justify-between">
              <div class="flex flex-row items-center space-x-2">
                <div>
                  <Icon :name="account.icon" class="w-[30px] h-[30px]" />
                </div>
                <div>{{ account.title }}</div>
              </div>
              <div>
                <span v-if="account.title == 'Total Payouts'">
                  {{ account.content.amount }} ( {{ account.content.count }} )
                </span>
                <span v-else>{{ account.content }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center mt-6 mb-2 space-x-2">
          <div>
            <Icon
              name="material-symbols:trending-up-rounded"
              class="w-[30px] h-[30px]"
            />
          </div>
          <div class="font-bold">Trading objectives</div>
          <div
            class="bg-green-200 text-green-custom trading-objectives-pill"
            v-if="activeChallenge.challengeOverview.tradingObjectives"
          >
            <Icon
              name="material-symbols:check-circle-rounded"
              class="w-[15px] h-[15px]"
            />
            Achieved
          </div>
          <div
            class="bg-red-200 text-red-custom trading-objectives-pill"
            v-else
          >
            <Icon name="material-symbols:cancel" class="w-[15px] h-[15px]" />
            Violated
          </div>
        </div>
        <div class="mb-2 challenge-limit-card">
          <header>Daily Loss Limit</header>
          <div class="font-bold text-medium">
            {{
              activeChallenge.challengeOverview.dailyLossLimit?.remaining
            }}
            Left
          </div>
          <div
            class="w-full overflow-hidden rounded-full mb-1 bg-gray-700 h-1.5"
          >
            <div
              class="rounded-full text-center font-medium slider leading-none space-x-2 h-1.5"
              :style="{
                width:
                  activeChallenge.challengeOverview.dailyLossLimit?.percentage +
                  '%',
              }"
            ></div>
          </div>

          <div class="font-bold text-right">
            {{
              activeChallenge.challengeOverview.dailyLossLimit?.percentage + "%"
            }}
          </div>
          <div class="flex flex-col space-y-1 caption-nrm-faded">
            <div>
              Maximum
              {{
                activeChallenge.challengeOverview.dailyLossLimit?.maximum
              }}
              daily loss
            </div>
            <div>
              Today's starting balance/equity:
              {{
                activeChallenge.challengeOverview.dailyLossLimit
                  ?.startingBalance
              }}
            </div>
            <div>
              Threshold at:
              {{ activeChallenge.challengeOverview.dailyLossLimit?.threshold }}
            </div>
          </div>
        </div>
        <div class="challenge-limit-card">
          <header>Max Loss Limit</header>
          <div class="font-bold text-medium">
            {{ activeChallenge.challengeOverview.maxLossLimit?.remaining }} Left
          </div>
          <div
            class="w-full overflow-hidden rounded-full mb-1 bg-gray-700 h-1.5"
          >
            <div
              class="rounded-full text-center font-medium slider leading-none space-x-2 h-1.5"
              :style="{
                width:
                  activeChallenge.challengeOverview.maxLossLimit?.percentage +
                  '%',
              }"
            ></div>
          </div>

          <div class="font-bold text-right">
            {{
              activeChallenge.challengeOverview.maxLossLimit?.percentage + "%"
            }}
          </div>
          <div class="flex flex-col space-y-1 caption-nrm-faded">
            <div>
              Maximum
              {{ activeChallenge.challengeOverview.maxLossLimit?.maximum }} loss
            </div>
            <div>
              Threshold at:
              {{ activeChallenge.challengeOverview.maxLossLimit?.threshold }}
            </div>
          </div>
        </div>
      </aside>
    </div>
    <div
      class="grid items-stretch grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <div class="col-span-1 challenge-stats">
        <article class="mb-4">
          <header>
            <div>
              <Icon
                name="material-symbols:keyboard-double-arrow-up-rounded"
                class="w-[20px] h-[20px]"
              />
            </div>
            <div>Average Win</div>
          </header>
          <p class="text-green-custom">
            {{ activeChallenge.challengeOverview.averageWin }}
          </p>
        </article>
        <article>
          <header>
            <div>
              <Icon
                name="material-symbols:percent-rounded"
                class="w-[20px] h-[20px]"
              />
            </div>
            <div>Win Ratio</div>
          </header>
          <p>
            {{ activeChallenge.challengeOverview.winRatio }}
          </p>
        </article>
      </div>
      <div class="col-span-1 challenge-stats">
        <article class="mb-4">
          <header>
            <div>
              <Icon
                name="material-symbols:keyboard-double-arrow-down-rounded"
                class="w-[20px] h-[20px]"
              />
            </div>
            <div>Average Loss</div>
          </header>
          <p class="text-red-custom">
            {{ activeChallenge.challengeOverview.averageLoss }}
          </p>
        </article>
        <article>
          <header>
            <div>
              <Icon
                name="material-symbols:trending-up-rounded"
                class="w-[20px] h-[20px]"
              />
            </div>
            <div>Profit Factor</div>
          </header>
          <p>
            {{ activeChallenge.challengeOverview.profitFactor }}
          </p>
        </article>
      </div>
      <div class="col-span-1 md:col-span-2 lg:col-span-1">
        <div id="balance-equity-overview" class="flex flex-col p-6 space-y-2">
          <div>
            <div class="flex flex-row space-x-2">
              <div>
                <Icon
                  name="material-symbols:balance-rounded"
                  class="w-[30px] h-[30px]"
                />
              </div>
              <div class="font-bold">Balance Overview</div>
            </div>
            <div class="flex flex-row justify-between caption-nrm-faded">
              <div>
                ${{
                  activeChallenge.challengeOverview.balanceOverview?.minimum.toLocaleString(
                    "en-US"
                  )
                }}
                min
              </div>
              <div>
                ${{
                  activeChallenge.challengeOverview.balanceOverview?.maximum.toLocaleString(
                    "en-US"
                  )
                }}
                max
              </div>
            </div>
            <div>
              <input
                type="range"
                class="balance-equity-slider"
                min="0"
                max="100"
                :value="
                  ((activeChallenge.challengeOverview.balanceOverview?.value -
                    activeChallenge.challengeOverview.balanceOverview
                      ?.minimum) /
                    (activeChallenge.challengeOverview.balanceOverview
                      ?.maximum -
                      activeChallenge.challengeOverview.balanceOverview
                        ?.minimum)) *
                  100
                "
              />
            </div>
            <div class="mt-1 font-bold text-center caption-nrm-colored">
              ${{
                activeChallenge.challengeOverview.balanceOverview?.value.toLocaleString(
                  "en-US"
                )
              }}
            </div>
          </div>
          <div>
            <div class="flex flex-row space-x-2">
              <div>
                <Icon
                  name="material-symbols:balance-rounded"
                  class="w-[30px] h-[30px]"
                />
              </div>
              <div class="font-bold">Equity Overview</div>
            </div>
            <div class="flex flex-row justify-between caption-nrm-faded">
              <div>
                ${{
                  activeChallenge.challengeOverview.equityOverview?.minimum.toLocaleString(
                    "en-US"
                  )
                }}
                min
              </div>
              <div>
                ${{
                  activeChallenge.challengeOverview.equityOverview?.maximum.toLocaleString(
                    "en-US"
                  )
                }}
                max
              </div>
            </div>
            <div>
              <input
                type="range"
                class="balance-equity-slider"
                min="0"
                max="100"
                :value="
                  ((activeChallenge.challengeOverview.equityOverview?.value -
                    activeChallenge.challengeOverview.equityOverview?.minimum) /
                    (activeChallenge.challengeOverview.equityOverview?.maximum -
                      activeChallenge.challengeOverview.equityOverview
                        ?.minimum)) *
                  100
                "
              />
            </div>
            <div class="mt-1 font-bold text-center caption-nrm-colored">
              ${{
                activeChallenge.challengeOverview.balanceOverview?.value.toLocaleString(
                  "en-US"
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="p-6 mt-4 dashboard-table">
      <div class="mb-3 font-bold text-medium">Trading History</div>
      <table class="w-full text-left table-auto">
        <thead>
          <tr>
            <th><span>Symbol</span></th>
            <th><span>Type</span></th>
            <th><span>Open date</span></th>
            <th><span>Open</span></th>
            <th><span>Closed date</span></th>
            <th><span>Close</span></th>
            <th><span>TP</span></th>
            <th><span>SL</span></th>
            <th><span>Lots</span></th>
            <th><span>Commission</span></th>
            <th><span>Profit</span></th>
          </tr>
        </thead>
        <tbody
          v-for="(trading, tradingIndex) in activeChallenge.challengeOverview
            .tradingHistory"
          :key="trading.id"
        >
          <tr
            :class="{
              noborder:
                tradingIndex ==
                activeChallenge.challengeOverview.tradingHistory.length - 1,
            }"
          >
            <td>{{ trading.symbol }}</td>
            <td>
              <span
                class="table-pill"
                :class="{
                  'bg-yellow-custom': trading.type == 'Buy',
                  'bg-red-custom': trading.type == 'Sell',
                }"
                >{{ trading.type }}</span
              >
            </td>
            <td>{{ trading.openDate }}</td>
            <td>{{ trading.open }}</td>
            <td>{{ trading.closedDate }}</td>
            <td>{{ trading.close }}</td>
            <td>{{ trading.takeProfit }}</td>
            <td>{{ trading.stopLoss }}</td>
            <td>{{ trading.lots }}</td>
            <td>{{ trading.commission }}</td>
            <td>
              <span
                :class="{
                  'text-green-custom': trading.profit > 0,
                  'text-red-custom': trading.profit < 0,
                  'text-yellow-custom': trading.profit == 0,
                }"
              >
                <b v-show="trading.profit > 0">+</b
                ><b v-show="trading.profit < 0">-</b>${{
                  Math.abs(trading.profit)
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <CredentialsPopup ref="credentialsPopup" />
  </section>
</template>

<script setup>
const emit = defineEmits(["closeChallengeOverview"]);
function closeChallengeOverview() {
  emit("closeChallengeOverview");
}

import { ref } from "vue";
const credentialsPopup = ref(null);
function toggleCredentialsPopup() {
  credentialsPopup.value.toggleCredentialsPopup();
}

import useChallengeListStore from "~/store/modules/challengeListStore";
const challengeListStore = useChallengeListStore();
const activeChallenge = ref(challengeListStore.activeChallengeState);

onMounted(() => {
  challengeListStore.$subscribe((mutation, state) => {
    activeChallenge.value = state.activeChallengeState;
  });
});
</script>

<style scoped>
.challenge-stats article {
  @apply flex flex-col space-y-8 p-6;
}
.challenge-stats article header {
  @apply flex flex-row items-end space-x-1;
  font-weight: bold;
}
.challenge-stats article p {
  font-weight: bold;
}

.challenge-limit-card header {
  @apply mb-1;
  color: var(--dsecondary);
  font-weight: bold;
  font-size: var(--font-nrm);
}

.challenge-limit-card {
  @apply p-2;
  border: 1px solid var(--dgrey-100);
  border-radius: 4px;
}

.slider {
  background-color: var(--dtertiary);
}

.balance-equity-slider {
  width: 100%;
  appearance: none;
  height: 2px;
  background-color: var(--dgrey-100);
}

.balance-equity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: var(--dtertiary);
  cursor: pointer;
}

.balance-equity-slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: var(--dtertiary);
  cursor: pointer;
}

#line-chart {
  height: 670px;
}
</style>
