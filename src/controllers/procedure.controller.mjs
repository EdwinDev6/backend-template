import { cManager } from "../databases/connections.mjs";
export const getProcedures = async (req, res) => {
  try {
    const db = req.database;
    const pool = await cManager.connectToDB(db);
    const result = await pool.request()
      .query(`SELECT SPECIFIC_NAME AS procedureName
        FROM INFORMATION_SCHEMA.ROUTINES
        WHERE ROUTINE_TYPE = 'PROCEDURE'`);
    res.status(200).json({
      result: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const executeProcedure = async (req, res) => {
  const procedureName =
    req.body["procedureName"] || req.body["nombreProcedimiento"];

  const procedureParams =
    req.body["procedureParams"] || req.body["parametrosProcedimiento"] || {};

  const schema = req.schema || "dbo"

  if (!procedureName) {
    return res
      .status(400)
      .json({ error: "No se ha enviado el nombre del procedimiento" });
  }

  const db = req.database;
  const pool = await cManager.connectToDB(db);
  const request = pool.request();

  request.input("id_usuario", req?.user_id);

  if (Object.keys(procedureParams).length != 0 && procedureParams.constructor === Object) {
    for (let [key, value] of Object.entries(procedureParams)) {
      request.input(key, value);
    }
  }

  request
    .execute(`${schema}.${procedureName}`)
    .then((result) => {
      res.status(200).json({ message: "Procedure was excecuted sucessfully", data: result });
    })
    .catch((error) => {
      if (error.number === 8145) {
        return res.status(400).json({ message: error.message });
      }
      if (error.number === 2812) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: "Bad request" });
    });
};
