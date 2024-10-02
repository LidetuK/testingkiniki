<template>
    <main>
        <div class="rounded-lg px-4 py-3 bg-[--grey] mb-4">
            <h2 class="text-xl font-bold pb-3">Order Summary</h2>
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <p class="font-medium text-lg pb-3">{{ formattedCapital }} - {{ itemCategory.concat(' Account') }}
                    </p>
                    <p class="rounded-lg bg-gray-800 px-3 py-2 inline-block font-bold">{{ 'MatchTrader' }}</p>
                </div>
                <div class="h-[0.2px] w-full bg-gray-600 mt-4 mb-2 md:hidden">&nbsp;</div>
                <div class="md:-mt-12">
                    <p class="pb-1">Cost:</p>
                    <p class="font-extrabold pb-1 md:text-3xl">{{ formattedPurchasePrice }}</p>
                    <p class="text-xs">Additional charges apply</p>
                </div>
            </div>
        </div>
        <div class="rounded-lg px-4 py-3 bg-[--grey]">
            <h2 class="text-xl font-bold pb-3">Payment Method</h2>
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <CryptoCurrencySelectMenu @crypto-selected="($event) => handleCurrencySelected($event.currency)" />
            </div>
        </div>
        <button @click="handleClickCheckout"
            class="w-full rounded py-2 bg-[--primary] hover:bg-[--dprimary] my-4">Checkout</button>
    </main>
</template>
<script lang="ts" setup>
import useCheckoutStore from '~/store/modules/checkoutStore';
const { notify } = useNotification()

const showCheckout = ref(false)
const checkoutStore = useCheckoutStore()
const { capital, itemCategory, purchasePrice } = storeToRefs(checkoutStore)

const formattedPurchasePrice = computed(() => {
    return purchasePrice.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
});

const formattedCapital = computed(() => {
    return capital.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
});

import { accountTitlesData, databasePhaseTitlesData  } from "~/data/phasesData.js";
const accountTitles = ref(accountTitlesData);
const databasePhaseTitles = ref(databasePhaseTitlesData);
const handleCurrencySelected = (currency: string) => {
    const { email, purchasePrice, capital, capitalCurrency, itemCategory, account } = storeToRefs(checkoutStore)
    checkoutStore.setData({
        email: email.value!,
        purchasePrice: purchasePrice.value!,
        capital: capital.value!,
        capitalCurrency: capitalCurrency.value!,
        itemCategory: matchPhaseTitle(itemCategory.value),
        account: account.value!,
        purchaseCurrency: currency,
    })
    showCheckout.value = true
}

const handleClickCheckout = () => {
    if (showCheckout.value) {
        navigateTo({ path: 'checkout' })
    } else {
        notify({ title: 'Select currency', text: 'Please select currency' })
    }
}

function matchPhaseTitle(title) {
  return title == accountTitles.value.onePhase
    ? databasePhaseTitles.value.onePhase
    : title == accountTitles.value.twoPhase
    ? databasePhaseTitles.value.twoPhase
    : title == accountTitles.value.instantFunded
    ? databasePhaseTitles.value.instantFunded
    : "";
}

</script>
