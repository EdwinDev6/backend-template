import express from "express";
import helmet from "helmet";
import session from "express-session";
import crypto from "crypto";
import { SESSION_SECRET } from "./config.mjs";
import { ENVIRONMENT } from "./config.mjs";
import { loginRouter } from "./routes/login.routes.mjs";
import { homeRouter }  from "./routes/home.routes.mjs";

const app = express();

const sessionSettings = {
    genid: () => { return crypto.randomUUID(); },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },

}

if (ENVIRONMENT === "production") {
    sessionSettings.cookie = {
        secure: true,
    };
}

app.use(express.json());

app.use(session(sessionSettings
));

//Helper to send http headers appropiately
app.use(helmet());

//Reduces fingerprinting
app.disable("x-powered by");

// Add routes
app.use("/api", loginRouter);
app.use("/api", homeRouter);

export default app;
