export default defineEventHandler(async (event) => {
    try {
        const { amount_in_usd, currency_to } = getQuery(event);
        const { nowpaymentsUrl, nowpaymentsApiKey } =
            useRuntimeConfig().privateRuntimeConfig;
        if (!nowpaymentsUrl)
            throw Error("External API URL undefined, set the env variable!");

        const response = await fetch(
            `${nowpaymentsUrl}/v1/estimate?amount=${amount_in_usd}&currency_from=usd&currency_to=${currency_to}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-key": nowpaymentsApiKey,
                },
            }
        );

        const estimatedPrice = await response.json();
        // Estimated price success response
        // {
        //     "currency_from": "usd",
        //     "amount_from": 800,
        //     "currency_to": "tusd",
        //     "estimated_amount": "800.66387524"
        // }
        return {
            data: estimatedPrice,
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
