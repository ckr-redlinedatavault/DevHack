import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        socket.on("join-workspace", (teamId) => {
            if (!teamId) return;
            socket.join(teamId);
            console.log(`[Socket] User ${socket.id} joined workspace: ${teamId}`);
        });

        socket.on("send-message", (data) => {
            if (!data.teamId) return;
            console.log(`[Socket] Relay message for room ${data.teamId}`);
            // Use socket.to(teamId).emit to broadcast to EVERYONE ELSE in the room
            socket.to(data.teamId).emit("receive-message", data);
        });

        socket.on("ping-check", () => {
            socket.emit("pong-check", { timestamp: Date.now() });
        });

        socket.on("disconnect", (reason) => {
            console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
        console.log(`> Realtime Engine: Operational`);
    });
});