export default defineEventHandler(async (_event) => {
    try {
        const { nowpaymentsUrl, nowpaymentsApiKey } = useRuntimeConfig().privateRuntimeConfig;
        if (!nowpaymentsUrl)
            throw Error("External API URL undefined, set the env variable!");

        const response = await fetch(
            `${nowpaymentsUrl}/v1/currencies?fixed_rate=true`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-key": nowpaymentsApiKey,
                },
            }
        );

        const availableCurrencies = await response.json();
        return {
            data: availableCurrencies.currencies,
            error: null,
            success: true,
        };
    } catch (err) {
        console.log("🚀 ~ defineEventHandler ~ err:", err);
        return {
            data: null,
            error: err,
            success: false,
        };
    }
});
