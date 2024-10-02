export default class AccountsService {
    private externalApiUrl: string;
    private email: string;
    private password: string;
    private headers: Record<string, any>;
    private authorization: string | undefined;

    constructor(externalApiUrl: string, email: string, password: string) {
        this.externalApiUrl = externalApiUrl;
        this.email = email;
        this.password = password;
        this.headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    async createAccount(): Promise<any> {
        const response = await fetch(`${this.externalApiUrl}/users`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
        });

        if (response.status >= 500) {
            throw new Error(`Failed to create account: ${response.statusText}`);
        }

        const newAccount = await response.json();
        return newAccount;
    }

    async login(): Promise<any> {
        const response = await fetch(`${this.externalApiUrl}/authentication`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                strategy: "local",
                email: this.email,
                password: this.password,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to log in: ${response.statusText}`);
        }

        const loggedIn = await response.json();
        this.authorization = loggedIn.accessToken;
        return loggedIn;
    }

    async onboardingEmail(brevoAccount: string): Promise<any> {
        const headers = this.headers;
        headers.authorization = this.authorization;
        const response = await fetch(`${this.externalApiUrl}/emails`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                from: brevoAccount,
                to: this.email,
                purpose: "Onboarding",
                content: this.password,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to send onboarding email: ${response.statusText}`
            );
        }

        const emailResponse = await response.json();
        return emailResponse;
    }
}
