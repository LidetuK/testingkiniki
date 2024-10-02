<script setup lang="ts">
import { v4 as uuidV4 } from "uuid";
import cryptoCurrencies from "~/data/cryptoListData";
import currencyListData from "~/data/currencyListData";
import useCheckoutStore from "~/store/modules/checkoutStore";

const { appUrl } = useRuntimeConfig().public;
const { notify } = useNotification();
const checkoutStore = useCheckoutStore()
const { email: storeEmail, purchasePrice: storePurchasePrice, purchaseCurrency: storePurchaseCurrency, capital: storeCapital, capitalCurrency: storeCapitalCurrency, itemCategory: storeItemCategory, account: storeAccount } = storeToRefs(checkoutStore)

let email: string;
let purchasePrice: number;
let purchaseCurrency: string;
let capital: number;
let capitalCurrency: string;
let itemCategory: string;
let isMissingArgs = ref(true);

const checkForMissingArgs = () => {
  if (
    !storeEmail.value ||
    !storePurchasePrice.value ||
    !storePurchaseCurrency.value ||
    !storeCapital.value ||
    !storeCapitalCurrency.value ||
    !storeItemCategory.value
  ) {
    navigateTo("/");
    notify({
      title: "Missing required information",
      text: "Please ensure you filled the required information before loading the checkout page!",
    });
  } else {
    isMissingArgs.value = false;
  }
}

email = storeEmail.value!
purchasePrice = storePurchasePrice.value!// In dollars (default)
purchasePrice = purchasePrice * 1 // this displays as a string in production (I don't know why but this is the quickest solution I could come up with to convert it into a number)
purchaseCurrency = storePurchaseCurrency.value!; // Users preferred currency
capital = storeCapital.value!;
capitalCurrency = storeCapitalCurrency.value!;
itemCategory = storeItemCategory.value!;
// If not null, then the checkout is for a sub-account (one of many trading accounts under the main account)
const account = storeAccount.value ?? null;

const isCrypto = cryptoCurrencies.indexOf(purchaseCurrency) != -1;
const isCurrencyValid =
  isCrypto || currencyListData.indexOf(purchaseCurrency) != -1;
if (
  !email ||
  !purchasePrice ||
  !purchaseCurrency ||
  !capital ||
  !capitalCurrency ||
  !itemCategory ||
  !isCurrencyValid
) {
  navigateTo("/");
  notify({
    title: "Error",
    text: "Something went wrong while processing your input. Please confirm that you are using the correct link.",
  });
}

const errors = ref<string[]>([]);
// Check if a user with the email address already exists, checkout is for new users only and challenge accounts
const {
  data: existingUser,
  error: checkIfUserExistsError,
  execute: checkForExistingAccount,
} = await useFetch(`/api/checkout/existing-account?email=${email}`, {
  immediate: false,
  watch: false,
});

const checkIfUserExists = () => {
  if (!account && existingUser.value?.isAccountExists) { // account is not null when its a challenge account creation
    notify({ title: "Account Exists", text: "You already have an account!" });
  } else if (existingUser.value?.error || checkIfUserExistsError.value) {
    errors.value.push("Something went wrong while checking if the user exists");
    notify({
      title: "Error",
      text: "Something went wrong while checking if the user exists. Please retry purchase.",
    });
  }
};

// Get the minimum payment amount for the selected currency pair
const isPurchasePriceValid = ref(true);
const {
  data: minPaymentAmount,
  error: minPaymentAmountError,
  execute: checkMinPaymentAmount,
} = await useFetch(
  `/api/nowpayments/min-payment-amount?currency_from=${purchaseCurrency}`,
  {
    immediate: false,
    watch: false,
  }
);

const isMinAmountLessPurchasePrice = () => {
  const minFiatSupported = minPaymentAmount.value?.data?.fiat_equivalent;
  if (minPaymentAmountError.value || !minFiatSupported) {
    errors.value.push(
      "Something went wrong while checking the minimum payment amount"
    );
    notify({
      title: "Error",
      text: "Something went wrong while checking the minimum payment amount. Please retry purchase.",
    });
  }
  isPurchasePriceValid.value = minFiatSupported < purchasePrice;
};

// Get the crypto estimated price
const {
  data: estimatedPrice,
  error: estimatedPriceError,
  execute: checkEstimatedPrice,
} = await useFetch(
  `/api/nowpayments/estimated-price?amount_in_usd=${purchasePrice}&currency_to=${purchaseCurrency}`,
  {
    immediate: false,
    watch: false,
  }
);

const handleEstimatedPriceReq = () => {
  if (estimatedPriceError.value) {
    errors.value.push(
      "Something went wrong while calculated the estimated cost"
    );
    notify({
      title: "Error",
      text: "Something went wrong while calculated the estimated cost",
    });
  }
  if (
    estimatedPrice.value?.data.estimated_amount <
    minPaymentAmount.value?.data?.min_amount
  ) {
    const message = `The estimated amount (${estimatedPrice.value?.data.estimated_amount}) is less than the allowed minimum ${minPaymentAmount.value?.data?.min_amount}`;
    errors.value.push(message);
    notify({ title: "Error", text: message });
  }
};

const loadingStart = ref(false);
onMounted(async () => {
  loadingStart.value = true;
  checkForMissingArgs()
  if (isMissingArgs.value) {
    return;
  }
  await checkForExistingAccount();
  if (isCrypto) {
    await checkMinPaymentAmount();
    await checkEstimatedPrice();
  }

  loadingStart.value = false;

  checkIfUserExists();
  if (isCrypto) {
    isMinAmountLessPurchasePrice();
    handleEstimatedPriceReq();
  }
});

const product = {
  itemCategory: itemCategory,
  capital: capital,
  capitalCurrency: capitalCurrency,
  purchasePrice: purchasePrice, // this displays as a string in production (I don't know why but this is the quickest solution I could come up with to convert it into a number)
  purchaseCurrency: purchaseCurrency,
};

const formData = ref({
  id: "",
  currency: purchaseCurrency,
  amount: purchasePrice,
  description: `Order created by ${email} to purchase trading account worth ${capital}`,
  redirect_mode: "_TOP_WINDOW",
  callback_url: `${appUrl}/api/callback`,
  notification_id: "3f426a95-c362-4694-8410-dcf0581b2fc4",
  billing_address: {
    email_address: email,
  },
});

// The approach below does not work on cpanel
// I suspect that cpanel blocks Nuxt server api requests
// const createCheckoutRecord = async (
//   orderMerchantReference: string,
//   email: string,
//   product: Record<string, any>
// ) => {
//   const checkoutResponse = await $fetch("/api/checkout/checkout", {
//     method: "post",
//     body: { email, orderMerchantReference, ...product },
//   });
//   if (!checkoutResponse.success)
//     throw Error(
//       `Failed to create checkout with error: ${checkoutResponse.error}`
//     );
// };

const { externalApiUrl } = useRuntimeConfig().public;
const createCheckoutRecord = async (
  orderMerchantReference: string,
  email: string,
  product: Record<string, any>
) => {
  try {
    // Submit Order Request
    if (!externalApiUrl)
      throw Error("External API URL undefined, set the env variable!");
    const payload = account ? { email, orderMerchantReference, ...product, newChallengeAccount: { ...account, email } } : { email, orderMerchantReference, ...product };
    const response = await fetch(`${externalApiUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw Error("Adding item to checkout failed");
    }

    await response.json();
  } catch (err: any) {
    throw Error(
      `Failed to create checkout`
    );
  }
};

const orderResponse = ref<any>();
const payViaPesapal = async () => {
  try {
    // Order Request (Pesapal)
    const accountOrder = await $fetch("/api/pesapal/order", {
      method: "post",
      body: { formData: formData.value },
    });
    if (accountOrder.status != "200" || accountOrder.error) {
      throw Error(`Something went wrong ${accountOrder.error}`);
    }
    orderResponse.value = accountOrder;
  } catch (err: any) {
    notify({ title: "Error", text: err.message });
  }
};

// The approach below does not work on cpanel
// const payViaNowPayments = async () => {
//   try {
//     // Create Nowpayments invoice
//     const invoiceResponse = await $fetch("/api/nowpayments/create-invoice", {
//       method: "post",
//       body: {
//         price_amount: purchasePrice,
//         price_currency: "usd",
//         pay_currency: purchaseCurrency,
//         ipn_callback_url: `${appUrl}/api/nowpayments/ipn`,
//         order_id: formData.value.id,
//         order_description: `${capital} USD ${itemCategory}`,
//         is_fixed_rate: true,
//         is_fee_paid_by_user: true,
//         success_url: `${appUrl}/nowpayments/success`,
//         cancel_url: `${appUrl}/nowpayments/cancel`,
//       },
//     });
//     if (!invoiceResponse.success)
//       throw Error(
//         `Failed to create checkout with error: ${JSON.stringify(invoiceResponse.error)}`
//       );
//     orderResponse.value = invoiceResponse?.data;
//     // Navigate to external payment page instead of using an iframe
//     navigateTo(invoiceResponse?.data?.invoice_url, { external: true });
//   } catch (err: any) {
//     notify({ title: "Error", text: err.message });
//   }
// };
const payViaNowPayments = async () => {
  try {
    // Create Nowpayments invoice
    const response = await fetch(`${externalApiUrl}/nowpayments/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-Service-Method": "createInvoice" // feathers JS specific for custom methods
      },
      body: JSON.stringify({
        price_amount: applyPercentageDiscount(purchasePrice),
        price_currency: "usd",
        pay_currency: purchaseCurrency,
        ipn_callback_url: `${externalApiUrl}/nowpayments/ipn`,
        order_id: formData.value.id,
        order_description: account ? `new challenge ${capital} USD ${itemCategory} account` : `${capital} USD ${itemCategory}`,
        is_fixed_rate: true,
        is_fee_paid_by_user: true,
        success_url: `${appUrl}/nowpayments/success`,
        cancel_url: `${appUrl}/nowpayments/cancel`,
      }),
    });
    if (!response.ok) {
      throw Error(
        `Failed to create checkout with error: ${JSON.stringify(response.statusText)}`
      );
    }
    const invoiceResponse = await response.json();
    orderResponse.value = invoiceResponse?.data;
    // Navigate to external payment page instead of using an iframe
    navigateTo(invoiceResponse?.data?.invoice_url, { external: true });
  } catch (err: any) {
    notify({ title: "Error", text: err.message });
  }
}

const loadingPay = ref(false);
const pay = async () => {
  try {
    loadingPay.value = true;
    const orderMerchantReference = uuidV4();
    formData.value.id = orderMerchantReference;
    await createCheckoutRecord(orderMerchantReference, email, product);
    if (isCrypto) {
      await payViaNowPayments();
    } else {
      await payViaPesapal();
    }
    loadingPay.value = false;
    // Ensure iframe is visible on mobile view
    scrollToElement();
  } catch (err: any) {
    notify({ title: "Error", text: `Something went wrong: ${err}` })
  }
};

const sectionRef = ref(null);
const scrollToElement = () => {
  if (sectionRef.value) {
    sectionRef.value.scrollIntoView({
      behavior: "smooth",
    });
  }
};

const isPromoActive = true // Disable discount promos
const DISCOUNT_CODE = "DISCOUNT 20% OFF"
const discountCode = ref(null)
const isUseDiscountCode = ref(false)
const useDiscountCode = () => {
  isUseDiscountCode.value = true
  // notify({ title: "No Discount Promos Available", text: "There isn't an active discount campaign at the moment."})
}
const resetDiscount = () => {
  discountCode.value = null
  isUseDiscountCode.value = false
}
const applyPercentageDiscount = (price: number) => {
  const discountedAmount = discountCode.value == DISCOUNT_CODE ? price * 0.8 : price
  if (minPaymentAmount.value?.data?.min_amount > discountedAmount) {
    isPurchasePriceValid.value = false;
    return;
  }
  return isPromoActive && isUseDiscountCode.value ? discountedAmount : price;
}

const formattedPurchasePrice = computed(() => {
  return storePurchasePrice.value?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
});

const formattedCapital = computed(() => {
  return storeCapital.value?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
});
</script>

<template>
  <div class="bg-[#F5F5F5] w-screen min-h-screen pt-8 px-4 flex flex-col items-center lg:pt-20">
    <header>
      <nav>
        <NuxtLink to="/" class="flex items-center gap-4 mb-8 text-gray-600">
          <Icon name="weui:back-filled" />Back
        </NuxtLink>
      </nav>
      <div class="flex gap-4 pb-8 flex-col md:flex-row lg:w-[66vw] 2xl:max-w-[1200px]">
        <img src="/img/icons/header-icon.svg" alt="" width="28" height="28" />
        <div>
          <h2 class="text-xl font-semibold">Checkout</h2>
          <p class="text-gray-400">
            Select payment gateway and click pay to complete payment
          </p>
        </div>
      </div>
    </header>
    <main>
      <div class="h-[55vh] flex justify-center" v-if="loadingStart">
        <img src="/img/bgs/404-background.webp" class="object-contain animate-pulse" height="200px" width="200px" />
      </div>
      <div v-else-if="!loadingStart && !isPurchasePriceValid"
        class="h-[55vh] flex flex-col justify-center items-center gap-4">
        <h3 class="text-lg font-bold text-red-600">
          The purchase price is below the required minimum of ${{
            minPaymentAmount?.data?.fiat_equivalent ?? ""
          }}
        </h3>
        <p></p>
      </div>
      <div v-else-if="!loadingStart && errors.length > 0"
        class="h-[55vh] flex flex-col justify-center items-center gap-4">
        <h3 class="text-lg font-bold text-red-600">Something went wrong :(</h3>
        <p class="text-center">
          Try refreshing the page. <br />If the error persists, <br /><a :href="'mailto:enquiries@kisikicapital.com?subject=Error(checkout)&body=' +
            `Error checking if a user exists: ${errors.join('; ')}`
            " class="text-blue-600 underline">please click this link to report so that we can resolve
            it.</a><br />Sorry for the inconvenience caused.
        </p>
        <ul class="flex flex-col max-w-md gap-2 p-4 mx-auto mt-2 text-sm list-disc list-inside rounded bg-red-50">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>
      </div>
      <div class="lg:flex lg:justify-between lg:items-stretch lg:gap-8 lg:w-[66vw] 2xl:max-w-[1200px]"
        v-else-if="(!loadingStart && !existingUser?.isAccountExists) || (!loadingStart && existingUser?.isAccountExists && account)">
        <div class="p-4 mb-8 bg-white shadow rounded-xl lg:mb-0 lg:w-1/2 lg:h-full">
          <h3 class="pb-4 font-medium">Checkout Summary</h3>
          <div class="flex flex-col gap-1 lg:flex-row lg:justify-between">
            <p class="font-medium text-gray-400 lg:text-gray-900">Capital</p>
            <p class="font-medium">
              {{
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: capitalCurrency ?? 'USD',
                }).format(capital)
              }}
            </p>
          </div>
          <form class="max-w-xl mt-4">
            <label for="email_address">Discount Code:</label>
            <input type="text" id="discount_code" name="discount_code" class="w-full px-3 py-2 mb-3 border rounded"
              placeholder="Enter discount code" :disabled="loadingPay" v-model="discountCode" />
            <div class="flex justify-between">
              <button aria-label="Apply Discount Code"
                class="py-2 px-3 rounded bg-opacity-20 bg-[#EA9D2C] cursor-not-allowed mb-4"
                @click.prevent="useDiscountCode">
                Apply Code</button>
              <button aria-label="Apply Discount Code" type="reset" @click.prevent="resetDiscount"
                class="py-2 px-3 rounded bg-opacity-20 bg-[#EA9D2C] cursor-not-allowed mb-4">
                Reset</button>
            </div>
            <hr />
            <button aria-label="Pay Amount" type="submit" @click.prevent="pay" :disabled="loadingPay ||
              orderResponse?.redirect_url ||
              orderResponse?.invoice_url
              " :class="[
                orderResponse?.redirect_url || orderResponse?.invoice_url
                  ? 'hover:bg-opacity-20 cursor-not-allowed'
                  : 'hover:bg-opacity-100',
                loadingPay ? 'animate-pulse' : '',
              ]" class="w-full flex justify-between py-2 px-3 rounded bg-opacity-40 bg-[#EA9D2C] mt-4">
              <span>Pay</span>
              <div class="flex items-center gap-4">
                <span>
                  {{
                    applyPercentageDiscount(isCrypto
                      ? parseFloat(estimatedPrice?.data?.estimated_amount)
                      : purchasePrice)
                  }}
                </span>
                <span class="text-sm">
                  {{
                    isCrypto
                      ? estimatedPrice?.data?.currency_to
                      : purchaseCurrency
                  }}
                </span>
              </div>
            </button>
            <p class="pt-4">Please ensure you pay an <u>exact amount to the last decimal number</u>. Any less and it
              will be recorded as partial payment.</p>
          </form>
        </div>

        <div class="w-full overflow-auto bg-white shadow rounded-xl lg:order-first lg:w-1/2" ref="sectionRef">
          <!-- <div v-if="orderResponse?.redirect_url || orderResponse?.invoice_url">
            <iframe
              :src="orderResponse.redirect_url || orderResponse.invoice_url" -->
          <div v-if="orderResponse?.redirect_url">
            <iframe :src="orderResponse.redirect_url" frameborder="0" width="100%" height="600px"
              class="mx-auto md:max-w-xl"></iframe>
          </div>
          <!--#region order summary-->
          <div class="w-full rounded-lg p-4 mb-4" v-else>
            <h2 class="text-xl font-bold pb-3">Order Summary</h2>
            <div class="flex flex-col">
              <div>
                <p class="font-medium text-lg pb-3">{{ formattedCapital }} - {{ itemCategory?.concat(' Account') }}
                </p>
                <p class="rounded-lg bg-gray-100 px-3 py-2 inline-block font-bold">{{ 'MatchTrader' }}</p>
              </div>
              <div class="h-[0.2px] w-full bg-gray-300 mt-4 mb-2">&nbsp;</div>
              <div>
                <p class="pb-1">Cost:</p>
                <p class="font-extrabold pb-1 md:text-3xl">{{ formattedPurchasePrice }}</p>
                <p class="text-xs">Additional charges apply</p>
              </div>
            </div>
          </div>
          <!--#endregion-->
        </div>
      </div>
      <div v-else class="h-[55vh] flex items-center">
        <p>
          You already have an account.
          <a href="#" class="text-indigo-500 underline">Sign in?</a>
        </p>
      </div>
    </main>
    <footer class="flex flex-col items-center py-16 lg:w-[66vw] 2xl:max-w-[1200px]">
      <h2 class="text-[#EA9D2C] pb-2 lg:self-start font-semibold lg:pb-4">
        Need Help?
      </h2>
      <div class="flex flex-col items-center gap-2 lg:w-full lg:flex-row lg:justify-between lg:gap-auto">
        <p class="flex items-center gap-1">
          <Icon name="ic:outline-email" />
          <a href="mailto:email@kisikicapital.info">Email Me</a>
        </p>
        <p>
          <a href="#" target="_blank" rel="noopener noreferrer" class="underline">Terms & Conditions</a>
        </p>
        <p class="flex items-center gap-1">
          <Icon name="ic:outline-phone" />
          <a href="tel:+255680082960">+255 680 082 960</a>
        </p>
      </div>
    </footer>
  </div>
</template>
