import { configDotenv } from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";
import http from "http";
import { initSockets } from "./socket.js";

configDotenv({
  path: "./.env",
});

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 4000;
    const server = http.createServer(app);
    initSockets(server);
    server.on("error", (error) => {
      console.log(error);
      throw error;
    });

    server.listen(port, () => {
      console.log(`Server started running at port ${port}`);
    });
  } catch (err) {
    console.log(`Internal server error`, err);
    throw err;
  }
};

startServer();
