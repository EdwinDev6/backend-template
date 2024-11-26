import { Router } from "express";
import {
  getProcedures,
  executeProcedure,
} from "../controllers/procedure.controller.mjs";
import { verifyJWT } from "../middlewares/verifyJWT.mjs";
import { verifyDB } from "../middlewares/verifyDB.mjs";

export const procedureRouter = Router();

procedureRouter.get("/procedures/", verifyJWT, verifyDB, getProcedures);

procedureRouter.post(
  "/procedures/execute",
  verifyJWT,
  verifyDB,
  executeProcedure
);
