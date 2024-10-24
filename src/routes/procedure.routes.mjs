import { Router } from "express";
import { getProcedures, getProceduresParams, executeProcedure } from "../controllers/procedure.controller.mjs";
import { verifyJWT } from "../middlewares/verifyJWT.mjs";

export const procedureRouter = Router()

procedureRouter.get('/procedures/getProcedures', verifyJWT, getProcedures)
procedureRouter.get('/procedures/getProceduresParams/:procedureName', verifyJWT, getProceduresParams)
procedureRouter.post('/procedures/excecute', verifyJWT, executeProcedure)

