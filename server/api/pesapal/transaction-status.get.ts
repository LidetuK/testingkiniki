export default defineEventHandler(async (event) => {
    try {
        // Get transaction status,
        // docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/gettransactionstatus
        const query = getQuery(event);
        const { pesapalUrl } = useRuntimeConfig().privateRuntimeConfig;

        const URL = `${pesapalUrl}/Transactions/GetTransactionStatus?orderTrackingId=${query.OrderTrackingId}`;
        const response = await fetch(URL, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `${event.node.req.headers.authorization}`,
            },
        });
        const transactionStatus = await response.json();
        if (transactionStatus.status != "200") {
            throw Error("Failed to get transaction status");
        }

        return transactionStatus;
    } catch (err: any) {
        return { message: "Error fetching data", error: err.message };
    }
});
