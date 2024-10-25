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

export const getProceduresParams = async (req, res) => {
  try {
    const db = req.database;
    const pool = await cManager.connectToDB(db);
    const { procedureName } = req.params;
    const result = await pool.request().input("procedureName", procedureName)
      .query(`
        SELECT DISTINCT PARAMETER_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.PARAMETERS 
        WHERE SPECIFIC_NAME = @procedureName
      `);
    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: "No parameters found for this procedure" });
    }

    const filteredParams = result.recordset.filter(
      (param) =>
        param.PARAMETER_NAME !== "@renglon" &&
        param.PARAMETER_NAME !== "@programa"
    );

    res.status(200).json(filteredParams);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const executeProcedure = async (req, res) => {
  const procedureName =
    req.body["procedureName"] || req.body["nombreProcedimiento"];
  const procedureParams =
    req.body["procedureParams"] || req.body["parametrosProcedimiento"];
  const schema = req.schema || "dbo";
  if (!procedureName) {
    return res
      .status(400)
      .json({ error: "No se ha enviado el nombre del procedimiento" });
  }
  const db = req.database;
  const pool = await cManager.connectToDB(db);
  const request = pool.request();
  for (let [key, value] of Object.entries(procedureParams)) {
    request.input(key, value);
  }
  request
    .execute(`${schema}.${procedureName}`)
    .then((result) => {
      res.status(200).json({ result: result["recordset"] });
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
