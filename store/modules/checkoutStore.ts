const useCheckoutStore = defineStore("checkout-store", () => {
    type Checkout = {
        email: string;
        purchasePrice: number;
        purchaseCurrency: string;
        capital: number;
        capitalCurrency: string;
        itemCategory: string;
        account?: Record<string, any>;
    };
    const email = ref<string | null>(null);
    const purchasePrice = ref<number | null>(null);
    const purchaseCurrency = ref<string | null>(null);
    const capital = ref<number | null>(null);
    const capitalCurrency = ref<string | null>(null);
    const itemCategory = ref<string | null>(null);
    const account = ref<Record<string, any> | null>(null);

    function setData(arg: Checkout) {
        email.value = arg.email;
        purchasePrice.value = arg.purchasePrice;
        purchaseCurrency.value = arg.purchaseCurrency;
        capital.value = arg.capital;
        capitalCurrency.value = arg.capitalCurrency;
        itemCategory.value = arg.itemCategory;
        account.value = arg?.account ?? null;
    }

    function getData() {
        return {
            email: email.value,
            purchasePrice: purchasePrice.value,
            purchaseCurrency: purchaseCurrency.value,
            capital: capital.value,
            capitalCurrency: capitalCurrency.value,
            itemCategory: itemCategory.value,
            account: account.value
        }
    }

    return {
        email,
        purchasePrice,
        purchaseCurrency,
        capital,
        capitalCurrency,
        itemCategory,
        account,
        setData,
        getData
    };
});

export default useCheckoutStore;
