export default class CheckoutService {
    private externalApiUrl: string;
    private headers: Record<string, string>;

    constructor(externalApiUrl: string, headers: Record<string, string>) {
        this.externalApiUrl = externalApiUrl;
        this.headers = headers;
    }

    async getCheckoutRecord(orderId: string): Promise<any> {
        const response = await fetch(
            `${this.externalApiUrl}/checkouts?orderMerchantReference=${orderId}`
        );

        if (!response.ok) {
            throw Error(`Failed to get user's email`);
        }

        const checkoutResponse = await response.json();

        if (checkoutResponse.total == 0) {
            throw Error(
                `Could not find a checkout with the order_id: ${orderId}`
            );
        }

        return checkoutResponse;
    }

    async createOrder(
        accessToken: string,
        payload: Record<string, any>
    ): Promise<any> {
        const headers = {
            ...this.headers,
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await fetch(`${this.externalApiUrl}/orders`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        const newOrder = await response.json();
        return newOrder;
    }

    async updateCheckout(
        accessToken: string,
        checkoutId: string,
        payload: Record<string, any>
    ): Promise<any> {
        const headers = {
            ...this.headers,
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await fetch(
            `${this.externalApiUrl}/checkouts/${checkoutId}`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        const checkoutUpdate = await response.json();
        return checkoutUpdate;
    }

    async createPaymentRecord(
        accessToken: string,
        payload: Record<string, any>
    ): Promise<any> {
        const headers = {
            ...this.headers,
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await fetch(`${this.externalApiUrl}/payments`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to create payment record: ${response.statusText}`
            );
        }

        const newPaymentRecord = await response.json();
        return newPaymentRecord;
    }

    async billingEmail(
        brevoAccount: string,
        recipient: string,
        content: Record<string, any>
    ): Promise<any> {
        const headers = this.headers;
        const response = await fetch(`${this.externalApiUrl}/emails`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                from: brevoAccount,
                to: recipient,
                purpose: "Receipt",
                content: content,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to send billing email: ${response.statusText}`
            );
        }

        const emailResponse = await response.json();
        return emailResponse;
    }

    async infoEmail(
        brevoAccount: string,
        recipient: string,
        content: string
    ): Promise<any> {
        const headers = this.headers;
        const response = await fetch(`${this.externalApiUrl}/emails`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                from: brevoAccount,
                to: recipient,
                purpose: "Info",
                content: content, // message
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to send acknowledgement email: ${response.statusText}`
            );
        }

        const emailResponse = await response.json();
        return emailResponse;
    }
}
