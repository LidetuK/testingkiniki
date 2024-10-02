export default defineEventHandler(async (event) => {
    try {
        // Submit Order Request
        const { externalApiUrl } = useRuntimeConfig().privateRuntimeConfig;
        if (!externalApiUrl)
            throw Error("External API URL undefined, set the env variable!");
        const checkoutObject = await readBody(event); 
        const response = await fetch(`${externalApiUrl}/checkouts`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(checkoutObject),
        });
        if (!response.ok) {
            throw Error("Adding item to checkout failed");
        }

        const checkoutResponse = await response.json();
        return { data: checkoutResponse, success: true, error: false };
    } catch (err: any) {
        return { data: err, error: true, success: false };
    }
});
