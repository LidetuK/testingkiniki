<template>
  <main id="payouts-table" class="m-4">
    <DashboardHeader
      :side-nav-title="'Payouts'"
      :side-nav-icon="`<svg xmlns='http://www.w3.org/2000/svg' fill='#9F9F9F' height='24px' viewBox='0 -960 960 960' width='24px'><path d='M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z'/></svg>`"
    />
    <section
      id="request-card"
      class="flex flex-col items-start justify-between px-8 py-6 mb-4 space-y-8 md:space-y-0 md:items-center md:flex-row"
    >
      <article>
        <div class="mb-2 font-bold title-md">Ready to request your payout?</div>
        <div class="caption-faded">
          Click on the button shown and fill out the required information. We
          will reach out <br />
          to you for further advancements.
        </div>
      </article>
      <article>
        <button
          aria-label="Request Payout"
          class="p-4 rounded btn-dcta"
          @click="openPayoutForm()"
        >
          Request Payout
        </button>
      </article>
    </section>
    <section class="p-6 dashboard-table">
      <table class="w-full text-left table-auto">
        <thead>
          <tr>
            <th><span>Reference Id</span></th>
            <th><span>Payout Type</span></th>
            <th><span>Requested On</span></th>
            <th><span>Method</span></th>
            <th><span>Status</span></th>
            <th><span>Amount</span></th>
            <th><span>Admin Note</span></th>
            <th><span>Certificate</span></th>
            <th><span>Invoice</span></th>
          </tr>
        </thead>
        <tbody v-for="(payout, payoutIndex) in payoutTable" :key="payout.refId">
          <tr :class="{ noborder: payoutIndex == payoutTable.length - 1 }">
            <td>{{ payout.refId }}</td>
            <td>
              <span>
                {{ payout.challengeNumber }}
                <br />
                {{ payout.challengeLevel }}
              </span>
            </td>
            <td>
              {{ payout.requestedOnDate }} <br />
              {{ payout.requestedOnTime }}
            </td>
            <td>{{ payout.method }}</td>
            <td>
              <span class="table-pill" >{{ payout.status }}</span>
            </td>
            <td>{{ payout.amount }}</td>
            <td>
              <span
                class="present"
                v-if="payout.adminNote"
                @click="showAdminNote(payout.adminNote)"
              >
                <Icon
                  name="material-symbols:info-outline-rounded"
                  class="w-[25px] h-[25px]"
                />
              </span>
              <span v-if="!payout.adminNote">- -</span>
            </td>
            <td>
              <span class="present" v-if="payout.certificate">
                <NuxtLink to="/certificates">
                  Link
                  <Icon
                    name="material-symbols:link-rounded"
                    class="w-[20px] h-[20px]"
                  />
                </NuxtLink>
              </span>
              <span v-if="!payout.certificate">- -</span>
            </td>
            <td>
              <span class="present" v-if="payout.invoice">
                <a :href="payout.invoice">
                  Download
                  <Icon
                    name="material-symbols:link-rounded"
                    class="w-[20px] h-[20px]"
                  />
                </a>
              </span>
              <span v-if="!payout.invoice">- -</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="isAdminNotePopup"
         class="flex flex-row items-center justify-center backdrop-filter backdrop-blur-sm popup-box-overlay"
      >
        <main class="px-8 py-6 popup-box">
          <article class="flex flex-row items-center justify-between">
            <div class="title-lg">Admin Note</div>
            <button class="btn-close" @click="hideAdminNote()">&times;</button>
          </article>
          <hr class="my-4 white-40-divider" />
          <div class="text-wrap">
            {{ adminNoteContent }}
          </div>
        </main>
      </div>
    </section>
  </main>
</template>

<script setup>
import payoutTableData from "~/data/payoutTableData.js";
const payoutTable = ref(payoutTableData);

const isAdminNotePopup = ref(false);
const adminNoteContent = ref("");
function showAdminNote(adminNote) {
  adminNoteContent.value = adminNote;
  isAdminNotePopup.value = true;
}
function hideAdminNote() {
  adminNoteContent.value = "";
  isAdminNotePopup.value = false;
}

const emit = defineEmits(["openPayoutForm"]);
function openPayoutForm() {
  emit("openPayoutForm");
}
</script>

<style scoped>
#payouts-table #request-card {
  background: var(--dgrey);
}

.dashboard-table .table-pill {
  background: var(--dtertiary);
}

td:nth-child(6) {
  color: var(--green);
}

td:nth-child(8) .present,
td:nth-child(9) .present {
  cursor: pointer;
  color: var(--dprimary);
}

td:nth-child(8) .iconify,
td:nth-child(9) .iconify {
  transform: rotate(135deg);
}

td:nth-child(8) .present:hover,
td:nth-child(9) .present:hover {
  text-decoration: underline;
}

a:hover {
  font-weight: normal;
}

.popup-box {
  min-width: 100px;
  max-width: 500px;
}
</style>
