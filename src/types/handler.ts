export interface OSCMessage {
    oscType?: "message";
    address: string;
    args: OSCArgument[] | OSCArgument;
}

export interface OSCArgument {
    type: "string" | "float" | "integer" | "blob" | "true" | "false" | "null" | "bang" | "timetag" | "array" | "double";
    value?: string | number | Buffer | boolean | null | [number, number] | OSCArgument[];
}

export type X32SocketErrorHandlerFunction = (err: Error) => void;
export type X32SocketConnectHandlerFunction = () => void;
export type X32SocketDisconnectHandlerFunction = () => void;
export type X32SocketMessageHandlerFunction = (msg: OSCMessage) => void;
