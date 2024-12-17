import app from "./server.mjs";
import { cManager } from "./databases/connections.mjs";
import { PORT } from "./config.mjs";

let server;

server = app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
  cManager.connectToBridgeDB();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
