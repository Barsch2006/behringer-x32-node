import dgram from "dgram";
import { OSCArgument, OSCMessage, fromBuffer, toBuffer as toOSCBuffer } from "osc-min";
import {
    X32SocketMessageHandlerFunction,
    X32SocketConnectHandlerFunction,
    X32SocketDisconnectHandlerFunction,
    X32SocketErrorHandlerFunction,
} from "./types/handler";

type X32ConnectionConfig = {
    host: string;
    port: number;
};

interface IX32 {
    // socket connection
    listen(path: string, callback: (msg: OSCMessage) => void): void;
    onDisconnect(callback: () => void): void;
    onConnect(callback: () => void): void;
    onErr(callback: (err: Error) => void): void;
    close(): void;
}

class X32 implements IX32 {
    private socket: dgram.Socket;
    private _socketConfig: X32ConnectionConfig;
    private _connected: boolean = false;
    private _listeners: Map<string, X32SocketMessageHandlerFunction> = new Map();
    private _onConnect?: X32SocketConnectHandlerFunction;
    private _onDisconnect?: X32SocketDisconnectHandlerFunction;
    private _onError?: X32SocketErrorHandlerFunction;
    private _turnOffTimeout?: NodeJS.Timeout;

    constructor(config: X32ConnectionConfig) {
        this._socketConfig = config;
        this.socket = dgram.createSocket("udp4");
        this.socket.bind(0, "0.0.0.0");
        this.socket.on("message", (msg, rinfo) => {
            if (rinfo.address !== this._socketConfig.host) return;
            else this._triggerTurnOffTimeout();
            if (!this._connected && this._onConnect) this._onConnect();
            const data = fromBuffer(msg);
            if (data.oscType === "message") {
                if (this._listeners.has(data.address)) {
                    const listener = this._listeners.get(data.address) as (msg: OSCMessage) => void;
                    listener(data);
                }
            }
        });

        this.socket.on("error", (err) => {
            if (this._onError) {
                this._onError(err);
            }
        });

        setInterval(() => {
            this.send("/status");
            this.send("/xremote");
        }, 1000);
    }

    /**
     * Listener for incoming messages on the socket connection
     * @param path the osc path to listen to
     * @param callback handler function for the specified path
     */
    public listen(path: string, callback: (msg: OSCMessage) => void) {
        this._listeners.set(path, callback);
    }

    /**
     * @param callback - function to be called if the X32 disconnects from the socket
     */
    public onDisconnect(callback: () => void) {
        this._onDisconnect = callback;
    }

    /**
     * @param callback - function to be called if the X32 (re-)connects to the socket
     */
    public onConnect(callback: () => void) {
        this._onConnect = callback;
    }

    /**
     * Listener for errors on the socket connection
     * @param callback - function to be called on error event to handle the error
     */
    public onErr(callback: (err: Error) => void): void {
        this._onError = callback;
    }

    /**
     * Closes the socket connection
     */
    public close(): void {
        this.socket.close();
    }

    private send(address: string, ...args: (string | number)[]) {
        const buffer = toOSCBuffer({
            address,
            args: args.map<OSCArgument>((arg) => {
                if (typeof arg === "number") {
                    return { type: "float", value: arg };
                } else if (typeof arg === "string") {
                    return { type: "string", value: arg };
                } else {
                    throw new Error("Unsupported argument type");
                }
            }),
        });
        this.socket.send(buffer, this._socketConfig.port, this._socketConfig.host);
    }

    private _triggerTurnOffTimeout() {
        if (this._turnOffTimeout) {
            clearTimeout(this._turnOffTimeout);
        }
        this._turnOffTimeout = setTimeout(() => {
            this._connected = false;
            if (this._onDisconnect) {
                this._onDisconnect();
            }
        }, 3000);
    }
}

export default X32;
