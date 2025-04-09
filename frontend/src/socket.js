import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACK_PORT, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false // We'll manually connect when needed
});

export default socket; 