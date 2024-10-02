export default defineEventHandler(async (event) => {
    // Expecting query params: OrderTrackingId=7e6b62d9-883e-440f-a63e-e1105bbfadc3&OrderMerchantReference=1515111111"
    const query = getQuery(event);
    // Pesapal requirement:
    // NB: Your callback page should not implement a json response.
    // Instead, redirect the customer to a page on your system showing the payment details.
    sendRedirect(
        event,
        `/payment-details?OrderTrackingId=${query.OrderTrackingId}&OrderMerchantReferenc=${query.OrderMerchantReference}`,
        302
    ); // 302 is the status code for temporary redirect
});
