import express from "express";
import helmet from "helmet";
import { PARSER_SECRET, ENVIRONMENT, FRONTEND_URL } from "./config.mjs";
import { loginRouter } from "./routes/login.routes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import { procedureRouter } from "./routes/procedure.routes.mjs";

const app = express();

if (ENVIRONMENT === "production") {
}

app.use(express.json());
app.use(cookieParser(PARSER_SECRET));

//Helper to send http headers appropiately
app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL, credentials: true
  }) 
);

//Reduces fingerprinting
app.disable("x-powered by");

// Add routes
app.use("/api", loginRouter);
app.use("/api", procedureRouter);

export default app;
