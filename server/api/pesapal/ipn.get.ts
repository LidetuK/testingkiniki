import { v4 as uuidV4 } from "uuid";
export default defineEventHandler(async (event) => {
    try {
        // Get query parameters,
        // example:
        // https://www.myapplication.com/response-page?OrderTrackingId=b945e4af-80a5-4ec1-8706-e03f8332fb04&OrderMerchantReference=TEST1515111119&OrderNotificationType=IPNCHANGE
        // Referece: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/submitorderrequest
        const query = getQuery(event);

        // Set URLs (Nuxt & Feathers server respectively)
        const { appUrl, externalApiUrl } = useRuntimeConfig().privateRuntimeConfig

        // #1. Get transaction status from our own API.
        // No need to set headers here, they are already set on the other side :)
        const transactionStatusResponse = await fetch(
            `${appUrl}/api/transaction-status?OrderTrackingId=${query.OrderTrackingId}`
        );
        const transactionStatus = await transactionStatusResponse.json();
        if (!transactionStatusResponse.ok || !transactionStatus || !transactionStatus.merchant_reference)
            throw Error("Failed to get the merchant reference");
        console.log("🚀 ~ ipn ~ 1:", 1);

        // #2. Use the orderMerchantReference in the checkouts table to get the email address & product
        const checkoutResponse = await fetch(
            `${externalApiUrl}/checkouts?orderMerchantReference=${transactionStatus.merchant_reference}`
        );
        const checkout = await checkoutResponse.json();
        if (!checkoutResponse.ok || !checkout || !checkout.data[0].email)
            throw Error(`Failed to get user's email`);
        console.log("🚀 ~ ipn ~ 2:", 2);

        // #3. Create a new account with that email and a random password
        const randomPassword = uuidV4();
        await fetch(`${externalApiUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: checkout.data[0].email,
                password: randomPassword,
            }),
        });
        // const newAccount = await newAccountResponse.json();
        // It might be a repeat user
        // if (!newAccount || !newAccount._id)
        //     throw Error(`Failed to create a new account`);
        console.log("🚀 ~ ipn ~ 3:", 3);

        // #4. Login
        const loginResponse = await fetch(`${externalApiUrl}/authentication`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                strategy: "local",
                email: checkout.data[0].email,
                password: randomPassword,
            }),
        });
        const login = await loginResponse.json();
        if (!loginResponse.ok || !login || !login.accessToken)
            throw Error(`Failed to authenticate the new account`);
        console.log("🚀 ~ ipn ~ 4:", 4);

        // #5. Store details in `orders` & `payments` after logging in with the new account
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${login.accessToken}`,
        };
        const orderResponse = await fetch(`${externalApiUrl}/orders`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                userId: login.user._id,
                itemCategory: checkout.data[0].itemCategory,
                capital: checkout.data[0].capital,
                capitalCurrency: checkout.data[0].capitalCurrency,
                purchasePrice: checkout.data[0].purchasePrice,
                purchaseCurrency: transactionStatus.currency,
                orderMerchantReference: query.OrderMerchantReference,
                pesapal: {
                    orderStatusCode: transactionStatus.status_code,
                    orderTrackingId: query.OrderTrackingId,
                },
            }),
        });
        const newOrder = await orderResponse.json()

        const paymentResponse = await fetch(`${externalApiUrl}/payments`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                userId: login.user._id,
                orderId: newOrder._id,
                paymentMethod: transactionStatus.payment_method,
                amount: transactionStatus.amount,
                currency: transactionStatus.currency,
                pesapal: {
                    paymentStatusDescription:
                        transactionStatus.payment_status_description,
                    confirmationCode: transactionStatus.confirmation_code,
                    paymentAccount: transactionStatus.payment_account,
                    callbackUrl: transactionStatus.call_back_url,
                    paymentStatusCode: transactionStatus.payment_status_code,
                    createdDate: transactionStatus.created_date,
                },
                paymentProvider: "Pesapal",
            }),
        });
        const paymentObject = await paymentResponse.json()
        console.log("🚀 ~ ipn ~ 5:", paymentObject);

        // #6. Send an email receipt & account details using the email address

        // Using https://developers.brevo.com as a cheaper alternative to https://www.mailgun.com/
        const brevoAccount = "derrickmbarani@gmail.com";
        await fetch(`${externalApiUrl}/emails`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                from: brevoAccount,
                to: checkout.data[0].email,
                purpose: "Onboarding",
                content: randomPassword,
            }),
        });
        await fetch(`${externalApiUrl}/emails`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                from: brevoAccount,
                to: checkout.data[0].email,
                purpose: "Receipt",
                content: {
                    merchantReference: transactionStatus.merchant_reference,
                    itemCategory: checkout.data[0].itemCategory,
                    createdDate: transactionStatus.created_date,
                    capital: checkout.data[0].capital,
                    capitalCurrency: checkout.data[0].capitalCurrency,
                    accounts: 1,
                    amount: transactionStatus.amount,
                    paymentCurrency: transactionStatus.currency,
                    paymentMethod: transactionStatus.payment_method,
                    paymentAccount: transactionStatus.payment_account
                },
            }),
        });
        console.log("🚀 ~ ipn ~ 6:", 6);

        // #7. Update Checkout, set `isAccount` to true signifying the checkout led to account creation
        const checkoutResponse2 = await fetch(
            `${externalApiUrl}/checkouts/${checkout.data[0]._id}`,
            {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({
                    isAccount: true
                }),
            }
        );
        const checkout2 = await checkoutResponse2.json()
        console.log(`🚀 ~ ipn ~ 7 - ${checkout.data[0]._id}`, checkout2);

        // Transaction status 
        // {
        //     "payment_method": "Visa",
        //     "amount": 100,
        //     "created_date": "2022-04-30T07:41:09.763",
        //     "confirmation_code": "6513008693186320103009",
        //     "payment_status_description": "Failed",
        //     "description": "Unable to Authorize Transaction.Kindly contact your bank for assistance",
        //     "message": "Request processed successfully",
        //     "payment_account": "476173**0010",
        //     "call_back_url": "https://test.com/?OrderTrackingId=7e6b62d9-883e-440f-a63e-e1105bbfadc3&OrderMerchantReference=1515111111",
        //     "status_code": 2,
        //     "merchant_reference": "1515111111",
        //     "payment_status_code": "",
        //     "currency": "KES",
        //     "error": {
        //         "error_type": null,
        //         "code": null,
        //         "message": null,
        //         "call_back_url": null
        //     },
        //     "status": "200"
        // }

        // Return the as instructed on the Pesapal docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/gettransactionstatus
        query.status = 200; // meaning request was received and processed
        return query;
    } catch (err: any) {
        console.log("🚀 ~ ipn ~ err:", err);
        // Return the as instructed on the Pesapal docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/gettransactionstatus
        const query = getQuery(event);
        query.status = 500; // meaning IPN request was received but there was an issue completing the process
        return query;
    }

});
