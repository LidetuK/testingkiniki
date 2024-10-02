import jwt from "jsonwebtoken";
import feathersClient from "../../../lib/feathersSocketClient";
export default defineEventHandler(async (event) => {
    try {
        const { externalApiUrl } = useRuntimeConfig().privateRuntimeConfig;
        console.log("🚀 ~ defineEventHandler ~ externalApiUrl:", externalApiUrl)
        const feathers = feathersClient(externalApiUrl);
        const { userId, token, newPassword } = await readBody(event);
        console.log("🚀 ~ defineEventHandler ~ newPassword:", newPassword)

        // Does the user exist?
        const userResponse = await feathers.service("users").find({
            query: { _id: userId },
        });
        console.log("🚀 ~ userResponse ~ userResponse:", userResponse)
        if (userResponse.total != 1) {
            throw Error("User does not exist");
        }

        // verify token
        const secret = userId + "-" + userResponse.data[0].updatedAt;
        console.log("🚀 ~ defineEventHandler ~ secret:", secret)
        const payload = jwt.verify(token, secret);
        console.log("🚀 ~ defineEventHandler ~ payload:", payload)

        // update password
        await feathers.service("users").patch(payload.id, {
            password: newPassword,
        });
        
        return {
            success: true,
            data: null,
        };
    } catch (err: any) {
        console.log("🚀 ~ defineEventHandler ~ err:", err)
        return sendError(
            event,
            createError({
                statusCode: err.statusCode || 500,
                statusMessage: err.message || "Internal Server Error",
            })
        );
    }
});
