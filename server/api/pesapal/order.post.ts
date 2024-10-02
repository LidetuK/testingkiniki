export default defineEventHandler(async (event) => {
    try {
        // Submit Order Request
        const { pesapalUrl } = useRuntimeConfig().privateRuntimeConfig;

        const URL = `${pesapalUrl}/Transactions/SubmitOrderRequest`; // Pesapal
        const { formData } = await readBody(event);
        const response = await fetch(URL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `${event.node.req.headers.authorization}`,
            },
            body: JSON.stringify(formData),
        });
        const submitOrderResponse = await response.json();
        return submitOrderResponse;
    } catch (err: any) {
        console.log("🚀 ~ defineEventHandler ~ err:", err)
        return { message: "Error fetching data", error: err.message };
    }
});
