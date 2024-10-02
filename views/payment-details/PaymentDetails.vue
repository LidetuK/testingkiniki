<template>
  <div>
    <h2 class="pt-20 pb-8 text-xl font-bold text-center">Payment Details</h2>
    <div class="max-w-lg mx-auto" v-if="loading">
      <PaymentDetailsHeader class="w-full animate-pulse lg:max-w-2xl lg:mx-auto">
        <h3 class="text-xl font-semibold">
          Order {{ route.params.OrderMerchantReference }}
        </h3>
        <p class="text-gray-400">
          Processing your order request ...<br />You will be notified once
          complete.
        </p>
      </PaymentDetailsHeader>
    </div>
    <div v-else class="px-4 pb-32">
      <PaymentDetailsHeader class="w-full lg:max-w-2xl lg:mx-auto">
        <h3 class="text-xl font-semibold">
          Order {{ route.params.OrderMerchantReference }}
        </h3>
        <p class="text-gray-400">Order summary</p>
      </PaymentDetailsHeader>
      <div class="mx-auto overflow-auto lg:max-w-2xl phase-table" v-if="data">
        <table class="mt-8 text-sm border table-auto">
          <tbody>
            <tr v-for="item in Object.entries(data)" :key="key">
              <td class="p-2 font-semibold border">{{ item[0] }}</td>
              <td class="p-2 border">{{ item[1] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mx-auto mt-8 lg:max-w-2xl" v-else-if="error">
        <h2 class="text-xl font-semibold">
          Fetching your transaction details failed
        </h2>
        <p class="text-gray-400">Error: {{ error }}</p>
        <button
          aria-label="Retry Getting Payment Details"
          class="flex items-center gap-1 rounded px-3 py-2 font-bold bg-[#EA9D2C] my-3 bg-opacity-80 hover:bg-opacity-100"
          :class="{ 'animate-pulse': loading }"
          @click.prevent="retryPaymentDetails"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// As per: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/gettransactionstatus
// NB: Your callback page (`/api/callback`) should not implement a json response.
// Instead, redirect the customer to a page(this very one) on your system showing the payment details.
const loading = ref(true);
const route = useRoute();

// Get transaction status
const { appUrl } = useRuntimeConfig().public;
const URL = `${appUrl}/api/transaction-status?OrderTrackingId=${route.query.OrderTrackingId}`;
const { data, error, refresh } = await useFetch(URL, {
  method: "get",
  watch: false, // Do not track request params or body
});
loading.value = false;

const retryPaymentDetails = async () => {
  loading.value = true;
  await refresh();
  alert(data.value.status);
  loading.value = false;
};
</script>
