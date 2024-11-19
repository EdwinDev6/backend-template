import { Router } from "express";
import { login } from "../controllers/login.controller.mjs";
import { logout } from "../controllers/logout.controller.mjs";
const loginRouter = Router();

loginRouter.post("/login", login);
loginRouter.get("/logout", logout)

export {loginRouter}
