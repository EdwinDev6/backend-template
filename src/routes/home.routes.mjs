import { Router } from "express";
import { home } from "../controllers/home.controller.mjs";
import { verifySession } from "../middlewares/verifySession.mjs";

export const homeRouter = Router();

homeRouter.get("/home", verifySession, home);

