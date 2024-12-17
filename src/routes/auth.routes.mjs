import { Router } from "express";

import { login } from "../controllers/login.controller.mjs";
import { logout } from "../controllers/logout.controller.mjs";
import { session } from "../controllers/session.controller.mjs";

import { verifyDB } from "../middlewares/verifyDB.mjs";
import { verifyJWT } from "../middlewares/verifyJWT.mjs";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/logout", logout)
authRouter.get("/session", verifyJWT, verifyDB, session)

export {authRouter}
