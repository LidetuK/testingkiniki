import jwt from "jsonwebtoken";
import feathersClient from "../../../lib/feathersSocketClient";
export default defineEventHandler(async (event) => {
    try {
        const { externalApiUrl, appUrl, emailAccount } =
            useRuntimeConfig().privateRuntimeConfig;
        const feathers = feathersClient(externalApiUrl);
        const { userId, token } = await readBody(event);

        // Does the user exist?
        const userResponse = await feathers.service("users").find({
            query: { _id: userId },
        });
        console.log("🚀 ~ userResponse ~ userResponse:", userResponse)
        if (userResponse.total == 0) {
            throw Error("User does not exist");
        }

        // verify token
        const secret =
            userId + "-" + userResponse.data[0].updatedAt;
        const payload = jwt.verify(token, secret)
        console.log("🚀 ~ defineEventHandler ~ payload:", payload)

        return {
            success: true,
            data: {
                id: payload.id, // attach to
                token: token // reset password hidden form field
            },
        };
    } catch (err: any) {
        return sendError(
            event,
            createError({
                statusCode: err.statusCode || 500,
                statusMessage: err.message || "Internal Server Error",
            })
        );
    }
});
