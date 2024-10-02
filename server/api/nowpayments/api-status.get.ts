export default defineEventHandler(async (_event) => {
    try {
        const { nowpaymentsUrl } = useRuntimeConfig().privateRuntimeConfig;
        if (!nowpaymentsUrl)
            throw Error("External API URL undefined, set the env variable!");

        const response = await fetch(`${nowpaymentsUrl}/v1/status`);

        const apiStatus = await response.json();
        console.log("🚀 ~ defineEventHandler ~ apiStatus:", apiStatus)
        return {
            apiStatusOk: apiStatus.message == "OK",
            error: null,
            success: true,
        };
    } catch (err) {
        return {
            apiStatusOk: null,
            error: err,
            success: false
        };
    }
});
