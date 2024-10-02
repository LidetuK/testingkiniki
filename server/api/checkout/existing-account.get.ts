export default defineEventHandler(async (event) => {
    try {
        const { email } = getQuery(event);

        const { externalApiUrl } = useRuntimeConfig().privateRuntimeConfig;
        if (!externalApiUrl)
            throw Error("External API URL undefined, set the env variable!");

        const response = await fetch(`${externalApiUrl}/users?email=${email}`);
        if (!response.ok) {
            throw Error(`Failed to confirm if the user already exists`);
        }
        const userAccount = await response.json();
        return {
            data: userAccount.data,
            error: false,
            success: true,
            isAccountExists: userAccount.total > 0 ? true : false,
        };
    } catch (err) {
        return {
            data: err,
            error: true,
            success: false,
            isAccountExists: null,
        };
    }
});
