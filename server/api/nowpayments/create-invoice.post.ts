export default defineEventHandler(async (event) => {
    try {
        const { nowpaymentsUrl, nowpaymentsApiKey } =
        useRuntimeConfig().privateRuntimeConfig;
        console.log("🚀 ~ defineEventHandler ~ nowpaymentsApiKey:", nowpaymentsApiKey)
        if (!nowpaymentsUrl)
            throw Error("External API URL undefined, set the env variable!");
        
        const payload = await readBody(event);
        console.log("🚀 ~ defineEventHandler ~ payload:", payload)
        const response = await fetch(`${nowpaymentsUrl}/v1/invoice`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-api-key": nowpaymentsApiKey,
            },
            method: "post",
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            throw Error('Something went wrong while creating an invoice(nowpayments)')
        }

        const invoice = await response.json();
        // Successful response
        // {
        //     "id": "4975768207",
        //     "token_id": "5744576980",
        //     "order_id": "12345678",
        //     "order_description": "10, 000 USD One Phase Funding",
        //     "price_amount": "800",
        //     "price_currency": "USD",
        //     "pay_currency": "BTC",
        //     "ipn_callback_url": "https://striking-keen-treefrog.ngrok-free.app",
        //     "invoice_url": "https://nowpayments.io/payment/?iid=4975768207",
        //     "success_url": null,
        //     "cancel_url": null,
        //     "customer_email": null,
        //     "partially_paid_url": null,
        //     "payout_currency": null,
        //     "created_at": "2024-08-15T21:37:23.968Z",
        //     "updated_at": "2024-08-15T21:37:23.968Z",
        //     "is_fixed_rate": true,
        //     "is_fee_paid_by_user": true
        // }
        console.log("🚀 ~ defineEventHandler ~ invoice:", invoice)
        return {
            data: invoice,
            error: null,
            success: true,
        };
    } catch (err) {
        console.error("🚀 ~ defineEventHandler ~ err:", err)
        return {
            data: null,
            error: JSON.stringify(err),
            success: false,
        };
    }
});
