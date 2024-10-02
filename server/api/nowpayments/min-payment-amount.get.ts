export default defineEventHandler(async (event) => {
    try {
        const { nowpaymentsUrl, nowpaymentsApiKey, nowpaymentsWalletCurrency } =
            useRuntimeConfig().privateRuntimeConfig;
        if (!nowpaymentsUrl)
            throw Error("External API URL undefined, set the env variable!");

        const { currency_from } = getQuery(event)
        const response = await fetch(
            `${nowpaymentsUrl}/v1/min-amount?currency_from=${currency_from}&currency_to=${nowpaymentsWalletCurrency}&fiat_equivalent=usd&is_fixed_rate=False&is_fee_paid_by_user=True`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-key": nowpaymentsApiKey,
                },
            }
        );
        if (!response.ok) {
            throw Error(`Failed to check nowpayment minimum payment amount`);
        }
        // Success response:
        // {
        //     "currency_from": "eth",
        //     "currency_to": "tusd",
        //     "min_amount": 0.00292852,
        //     "fiat_equivalent": 7.78116693
        // }
        const minPaymentAmount = await response.json();
        console.log("🚀 ~ defineEventHandler ~ minPaymentAmount:", minPaymentAmount)
        return {
            data: minPaymentAmount,
            error: null,
            success: true,
        };
    } catch (err) {
        return {
            data: null,
            error: err,
            success: false,
        };
    }
});
