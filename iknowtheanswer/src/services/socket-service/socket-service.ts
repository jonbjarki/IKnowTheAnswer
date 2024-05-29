import { io } from "socket.io-client";
const url = "http://localhost:4567"

export const socket = io(url);
