import { cManager } from "../databases/connections.mjs";
import sql from "mssql";
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
  console.log(req)
  const db = req.database;
  const pool = await cManager.connectToDB(db);
  try {
    console.log(req)
    const { procedureName } = req.params;
    const result = await pool
      .request()
      .input("procedureName", sql.VarChar, procedureName).query(`
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
  const db = req.database;
  const pool = await cManager.connectToDB(db);
  // const result = await pool.request()
};
