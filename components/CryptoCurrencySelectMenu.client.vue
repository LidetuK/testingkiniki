<script setup>
const emit = defineEmits(['cryptoSelected'])

const isNowpaymentsAvailable = ref(false)
const checkNowpaymentStatus = async () => {
    try {
        const response = await $fetch(`/api/nowpayments/api-status`)
        if (!response.apiStatusOk) {
            throw Error('Nowpayments is unavailable')
        }
        isNowpaymentsAvailable.value = true
    } catch (err) {
        isNowpaymentsAvailable.value = false
    }
}

const availableCurrenciesError = ref(null)
// const availableCurrencies = ref([])
// const KISIKI_CURRENCIES = ['usdttrc20', 'btc']
// const currencies = computed(() => {
//     availableCurrencies.filter(availableCurrency => {
//         return KISIKI_CURRENCIES.includes(availableCurrency)
//     })
// })
// const getAvailableCurrencies = async () => {
//     try {
//         const response = await $fetch(`/api/nowpayments/available-currencies`)
//         console.log("🚀 ~ getAvailableCurrencies ~ response:", response)
//         if (!response.data) {
//             throw Error('Something went wrong')
//         }
//         availableCurrencies.value.push(...response.data)
//     } catch (err) {
//         availableCurrenciesError.value = err.message
//     }
// }

const loading = ref(true)

onMounted(async () => {
    await checkNowpaymentStatus()
    // await getAvailableCurrencies()
    loading.value = false
})

const handleSelection = (event) => {
    emit('cryptoSelected', { currency: event.target.value })
}
</script>

<template>
    <div class="w-full">
        <div class="h-12 w-full rounded flex justify-center items-center gap-2 text-[--primary]" v-if="loading">
            <Icon name="ei:spinner-2" size="32" class="animate-spin" />
            loading
        </div>
        <div class="bg-red-500 text-sm text-center p-4 rounded" v-else-if="availableCurrenciesError">
            Something went wrong, Please use other payment options
        </div>
        <div v-else>
            <div class="flex items-center justify-between">
                <label for="crypto-options" class="text-[--white-70] font-bold">
                    Crypto Options
                </label>
                <p class="float-right flex items-center gap-2 text-xs" v-if="!loading">
                <div class="w-3 h-3 rounded-full" :class="[isNowpaymentsAvailable ? 'bg-green-600' : 'bg-red-600']">
                    &nbsp</div>{{ isNowpaymentsAvailable ? 'Available' : 'Unavailable' }}</p>
                <Icon name="ei:spinner-2" class="animate-spin" v-else />
            </div>
            <select id="crypto-options" @change="handleSelection"
                class="mt-2 bg-[--gradient2] border border-[--black] max-h-[150px] block focus:outline-none"
                :disabled="!isNowpaymentsAvailable" required>
                <option class="p-10 bg-[--primary]" selected>-select crypto-</option>
                <option class="p-10 bg-[--primary]" value="usdttrc20">USDTTRC20</option>
                <option class="p-10 bg-[--primary]" value="btc">BTC</option>
                <!-- <option class="p-10" v-for="currency in currencies">{{ currency }}</option> -->
            </select>
        </div>
    </div>
</template>

<style scoped>
select {
    border-image: var(--gradient2) 1;
}

option {
    background-color: var(--black);
}
</style>