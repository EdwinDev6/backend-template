import { Router } from "express";
import {
  getProcedures,
  getProceduresParams,
  executeProcedure,
} from "../controllers/procedure.controller.mjs";
import { verifyJWT } from "../middlewares/verifyJWT.mjs";
import { verifyDB } from "../middlewares/verifyDB.mjs";

export const procedureRouter = Router();

procedureRouter.get("/procedures/", verifyJWT, verifyDB, getProcedures);
procedureRouter.get(
  "/procedures/params/:procedureName",
  verifyJWT,
  verifyDB,
  getProceduresParams
);
procedureRouter.post(
  "/procedures/excecute",
  verifyJWT,
  verifyDB,
  executeProcedure
);
