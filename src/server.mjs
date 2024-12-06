import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { PARSER_SECRET, ENVIRONMENT, FRONTEND_URL } from "./config.mjs";
import { authRouter } from "./routes/auth.routes.mjs";
import { procedureRouter } from "./routes/procedure.routes.mjs";

const app = express();

if (ENVIRONMENT === "production") {
}

app.use(express.json());
app.use(cookieParser(PARSER_SECRET));
// use morgan to log requests to the console
app.use(morgan("dev"));
//Helper to send http headers appropiately
app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

//Reduces fingerprinting
app.disable("x-powered by");

// Add routes
app.use("/api", authRouter);
app.use("/api", procedureRouter);

export default app;
