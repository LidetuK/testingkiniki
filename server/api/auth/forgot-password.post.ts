import jwt from "jsonwebtoken";
import feathersClient from "../../../lib/feathersSocketClient";
export default defineEventHandler(async (event) => {
    let error = null;
    enum EndpointErrors {
        UserError = "User does not exist",
        EmailError = "Failed to send password reset email"
    }
    try {
        const { externalApiUrl, appUrl, emailAccount } =
            useRuntimeConfig().privateRuntimeConfig;
        const feathers = feathersClient(externalApiUrl);
        const { email } = await readBody(event);

        // Does the user exist?
        const userResponse = await feathers.service("users").find({
            query: { email },
        });
        if (userResponse.total != 1) {
            error = EndpointErrors.UserError
            throw Error(EndpointErrors.UserError);
        }

        // Generate password reset link
        const userId = userResponse.data[0]._id;
        const secret = userResponse.data[0]._id + "-" + userResponse.data[0].updatedAt;
        const token = jwt.sign({ id: userId, email }, secret);
        const resetLink = `${appUrl}/password-reset/${userId}/${token}`;

        // Send reset link via email

        const emailResponse = await fetch(`${externalApiUrl}/emails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                from: emailAccount,
                to: email,
                purpose: "Info", // determines the email template that will be applied
                subject: "Password Reset Link",
                content: `<p> Please click on <a href="${resetLink}">this link</a> to reset your password. </p>`, 
            }),
        });
        if (!emailResponse.ok) {
            error = EndpointErrors.EmailError
            throw new Error(
                `${EndpointErrors.EmailError}: ${userResponse.statusText}`
            );
        }

        return {
            success: true,
            data: { message: 'Password reset email successfully sent. Please check your primary or spam folder for the reset link.' },
        };
    } catch (err: any) {
        return sendError(
            event,
            createError({
                statusCode: error == EndpointErrors.UserError ? 404 : err.statusCode || 500,
                statusMessage: error == EndpointErrors.UserError ? error : err.message || "Internal Server Error"
            })
        );
    }
});
