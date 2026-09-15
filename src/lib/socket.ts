"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const getSocket = (): Socket => {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    socket = io(url, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
};