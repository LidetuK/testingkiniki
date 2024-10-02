import { v4 as uuidV4 } from "uuid";
import CheckoutService from "./../../services/checkout";
import AccountsService from "./../../services/accounts";

export default defineEventHandler(async (event) => {
    // docs: https://documenter.getpostman.com/view/7907941/2s93JusNJt#62a6d281-478d-4927-8cd0-f96d677b8de6
    try {
        const { externalApiUrl, emailAccount } =
            useRuntimeConfig().privateRuntimeConfig;

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        // #1. Get transaction status
        const ipnPayload = await readBody(event);
        console.log("🚀 ~ defineEventHandler ~ payload:", ipnPayload);
        const checkoutService = new CheckoutService(externalApiUrl, headers);

        // #2. Use the orderMerchantReference in the checkouts table to get the email address & product
        const checkoutResponse = await checkoutService.getCheckoutRecord(
            ipnPayload.order_id
        );
        console.log(
            "🚀 ~ defineEventHandler ~ checkoutResponse:",
            checkoutResponse
        );
        const email = checkoutResponse.data[0].email;
        const EMAIL_WORTHY_STATES = [
            "waiting",
            "confirming",
            "confirmed",
            "sending",
            "failed",
            "refunded", // What happens when the user has an account but want's a refund?
            "expired",
            "partially_paid", // Refund the client?
        ];
        if (EMAIL_WORTHY_STATES.includes(ipnPayload.payment_status)) {
            // send the client an email and stop here
            await checkoutService.infoEmail(
                emailAccount,
                email,
                `Transaction attempt received with status ${ipnPayload.payment_status}`
            );
            return;
        }
        // Steps for `finished` state - the funds have reached your personal address and the payment is finished;

        // #3. Create a new account with that email and a random password
        // Only throws an error on status code 5xx
        const accountsService = new AccountsService(
            externalApiUrl,
            email,
            uuidV4()
        );
        await accountsService.createAccount();

        // #4. Login
        const loginResponse = await accountsService.login();

        // #5. Store details in `orders` & `payments` after logging in with the new account

        const orderResponse = await checkoutService.createOrder(
            loginResponse.accessToken,
            {
                userId: loginResponse.user._id,
                itemCategory: checkoutResponse.data[0].itemCategory,
                capital: checkoutResponse.data[0].capital,
                capitalCurrency: checkoutResponse.data[0].capitalCurrency,
                purchasePrice: ipnPayload.price_amount,
                purchaseCurrency: ipnPayload.price_currency,
                orderMerchantReference: ipnPayload.order_id,
                nowpayments: ipnPayload,
            }
        );

        await checkoutService.createPaymentRecord(loginResponse.accessToken, {
            userId: loginResponse.user._id,
            orderId: orderResponse._id,
            paymentMethod: "Crypto",
            amount: ipnPayload.pay_amount,
            currency: ipnPayload.pay_currency,
            nowpayments: ipnPayload,
            paymentProvider: "Nowpayments",
        });

        // #6. Send an email receipt & account details using the email address
        await accountsService.onboardingEmail(emailAccount);

        const receipt = {
            merchantReference: ipnPayload.order_id,
            itemCategory: checkoutResponse.data[0].itemCategory,
            createdDate: ipnPayload.updated_at,
            capital: checkoutResponse.data[0].capital,
            capitalCurrency: checkoutResponse.data[0].capitalCurrency,
            accounts: 1,
            amount: ipnPayload.pay_amount,
            paymentCurrency: ipnPayload.pay_currency,
            paymentMethod: "Crypto",
            paymentAccount: "Crypto",
        };
        await checkoutService.billingEmail(emailAccount, email, receipt);

        // #7. Update Checkout, set `isAccount` to true signifying the checkout led to account creation
        await checkoutService.updateCheckout(
            loginResponse.accessToken,
            checkoutResponse.data[0]._id,
            { isAccount: true }
        );
        console.log("🚀 ~ defineEventHandler ~ checkoutService");

        ipnPayload.status = 200; // meaning request was received and processed
        return ipnPayload;

        // Example IPN payload
        // {
        //     actually_paid: 0,
        //     actually_paid_at_fiat: 0,
        //     fee: { currency: 'usdttrc20', depositFee: 0, serviceFee: 0, withdrawalFee: 0 },
        //     invoice_id: 6407932592,
        //     order_description: '10 USD one-phase-funding',
        //     order_id: 'c92c36af-fe99-494d-8b59-1c2b750c6ec2',
        //     outcome_amount: 801.384053,
        //     outcome_currency: 'usdttrc20',
        //     parent_payment_id: null,
        //     pay_address: 'TVzLNeon5T5p6xcFrKNRBGsf5kYa555mZG',
        //     pay_amount: 814.053119,
        //     pay_currency: 'usdttrc20',
        //     payin_extra_id: null,
        //     payment_extra_ids: null,
        //     payment_id: 5088114838,
        //     payment_status: 'waiting',
        //     price_amount: 800,
        //     price_currency: 'usd',
        //     purchase_id: '5644249424',
        //     updated_at: 1724067404468
        // }
    } catch (err: any) {
        console.log("🚀 ~ ipn ~ err:", err);
        setResponseStatus(event, 500, "Something went wrong");
        return { error: err };
    }
});

// Here the list of available statuses of payment:

// waiting - waiting for the customer to send the payment. The initial status of each payment;
// confirming - the transaction is being processed on the blockchain. Appears when NOWPayments detect the funds from the user on the blockchain;
// confirmed - the process is confirmed by the blockchain. Customer’s funds have accumulated enough confirmations;
// sending - the funds are being sent to your personal wallet. We are in the process of sending the funds to you;
// partially_paid - it shows that the customer sent the less than the actual price. Appears when the funds have arrived in your wallet;
// finished - the funds have reached your personal address and the payment is finished;
// failed - the payment wasn't completed due to the error of some kind;
// refunded - the funds were refunded back to the user;
// expired - the user didn't send the funds to the specified address in the 7 days time window;
