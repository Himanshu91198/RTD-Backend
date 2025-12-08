import { Server } from "socket.io";
import { Document } from "./models/documents.model.js";

export const initSockets = async (server) => {
  try {
    const documentUsers = {};
    const io = new Server(server, {
      cors: {
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      socket.on("joined-document", async ({ documentId, username }) => {
        socket.join(documentId);
        if (!documentUsers[documentId]) documentUsers[documentId] = [];
        if (!documentUsers[documentId].includes(username))
          documentUsers[documentId].push(username);
        const doc = await Document.findById(documentId);
        const content = doc.content;
        socket.emit("initial-users", documentUsers[documentId]);
        socket.emit("initial-content", content);
        socket.to(documentId).emit("user-joined", username);
      });
      socket.on("left-document", ({ documentId, username }) => {
        socket.leave(documentId);
        if (documentUsers[documentId])
          documentUsers[documentId] = documentUsers[documentId].filter(
            (u) => u !== username
          );
        socket.to(documentId).emit("user-left", username);
      });
      socket.on("send-changes", ({ documentId, value }) => {
        socket.to(documentId).emit("receive-changes", value);
      });
    });
  } catch (err) {}
};
