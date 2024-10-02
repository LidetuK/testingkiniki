<template>
  <div
    v-if="myErrors"
    class="w-full py-2 my-3 text-center text-white bg-red-600"
  >
    {{ myErrors }}
  </div>
  <form class="max-w-xl mx-auto mt-20">
    <label for="currency" class="mx-3 text-gray-500">Currency:</label>
    <select
      id="currency"
      name="currency"
      v-model="formData.currency"
      class="w-full px-3 py-2 mx-3 mb-3 border rounded"
    >
      <option>KES</option>
      <option>UGX</option>
      <option>TZS</option>
    </select>
    <br />

    <fieldset class="w-full px-3 mx-3 border rounded">
      <legend class="px-1 pb-2 mx-3 text-sm text-gray-400">
        Billing Address
      </legend>

      <label for="email_address" class="mx-3 text-gray-500"
        >Email Address:</label
      >
      <input
        type="text"
        id="email_address"
        name="billing_address[email_address]"
        v-model="formData.billing_address.email_address"
        class="w-full px-3 py-2 mb-3 border rounded"
        required
      />
      <br />
    </fieldset>

    <button
      aria-label="Pay Amount"
      type="submit"
      class="px-6 py-2 m-3 text-white border rounded bg-sky-600 hover:bg-sky-800"
      @click.prevent="pay"
      :class="[loading ? 'cursor-not-allowed bg-gray-400 animate-pulse' : '']"
      :disabled="loading"
    >
      Pay&nbsp;{{ formData.amount }}&nbsp; {{ formData.currency }}
    </button>
  </form>
  <div v-if="orderResponse?.redirect_url">
    <iframe
      :src="orderResponse.redirect_url"
      frameborder="0"
      width="100%"
      height="500px"
      class="mx-auto md:max-w-xl"
    ></iframe>
  </div>
  <p class="flex justify-center w-full my-10 bg-gray-100 text-wrap">
    <code class="max-w-lg overflow-auto">Request:&nbsp;{{ formData }}</code>
  </p>
  <p class="flex justify-center w-full my-10 bg-gray-100 text-wrap">
    <code class="max-w-lg overflow-auto"
      >Order Response:&nbsp;{{ orderResponse }}</code
    >
  </p>
</template>
<script setup lang="ts">
import { v4 as uuidV4 } from "uuid";

const { appUrl } = useRuntimeConfig().public;

const formData = ref({
  id: uuidV4(),
  currency: "KES",
  amount: 1,
  description: "Test order",
  redirect_mode: "_TOP_WINDOW",
  callback_url: `${appUrl}/api/callback`,
  notification_id: "3f426a95-c362-4694-8410-dcf0581b2fc4",
  billing_address: {
    email_address: null,
  },
});

const orderResponse = ref<any>();
const myErrors = ref<any>();
const loading = ref(false);
const pay = async () => {
  try {
    loading.value = true;

    // Order Request
    const response = await $fetch("/api/pesapal/order", {
      method: "post",
      body: { formData: formData.value },
    });
    if (response.status != "200" || response.error)
      throw Error(`Something went wrong ${response.error}`);
    orderResponse.value = response;
  } catch (err: any) {
    console.log("🚀 ~ pay ~ err:", err);
    myErrors.value = err;
  } finally {
    loading.value = false;
  }
};
</script>
