import feathersClient from "../../../lib/feathersSocketClient";
export default defineEventHandler(async (event) => {
    try {
        const { externalApiUrl } = useRuntimeConfig().privateRuntimeConfig;
        const feathers = feathersClient(externalApiUrl);

        const { email, password } = await readBody(event);
        const response = await feathers.authenticate({
            strategy: "local",
            email,
            password,
        });
        return {
            success: true,
            data: response,
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
