import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

const client = (externalApiUrl: string) => {
    const socket = io(externalApiUrl);
    const client = new feathers.Feathers();

    client.configure(socketio(socket));
    client.configure(authentication());
    return client;
};
export default client;
