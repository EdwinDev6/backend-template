import express from "express";
import helmet from "helmet";
import session from "express-session";
import crypto from "crypto";
import { PARSER_SECRET, SESSION_SECRET } from "./config.mjs";
import { ENVIRONMENT } from "./config.mjs";
import { loginRouter } from "./routes/login.routes.mjs";
import { homeRouter }  from "./routes/home.routes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const sessionSettings = {
    genid: () => { return crypto.randomUUID(); },
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000,
        secure: false,
    },

}

if (ENVIRONMENT === "production") {
    sessionSettings.cookie = {
        secure: true,
    };
}

app.use(express.json());
app.use(cookieParser(PARSER_SECRET))
app.use(session(sessionSettings
));


//Helper to send http headers appropiately
app.use(helmet());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

//Reduces fingerprinting
app.disable("x-powered by");

// Add routes
app.use("/api", loginRouter);
app.use("/api", homeRouter);

export default app;
