import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import authentication from "@feathersjs/authentication-client";

const client = (externalApiUrl: string) => {
    const client = new feathers.Feathers();
    const restClient = rest(externalApiUrl);

    client.configure(restClient.fetch(window.fetch.bind(window)));
    client.configure(authentication());
    return client;
};
export default client;
