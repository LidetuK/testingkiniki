export default defineEventHandler(async (event) => {
    try {
        const url = event.node.req.url;

        if (url?.indexOf("/api/pesapal") == -1) {
            // filter to only work for pesapal api requests
            return;
        }

        const { consumerKey, consumerSecret, pesapalUrl } =
            useRuntimeConfig().privateRuntimeConfig;
        const URL = `${pesapalUrl}/Auth/RequestToken`;
        const creds = {
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
        };
        const response = await fetch(URL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(creds),
        });
        const tokenObject = await response.json();
        event.node.req.headers.authorization = `Bearer ${tokenObject.token}`;
    } catch (err: any) {
        event.node.res.statusCode = err.statusCode;
    }
});
