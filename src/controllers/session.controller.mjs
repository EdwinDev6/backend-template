import { cManager } from "../databases/connections.mjs";
import { DB_API_KEY } from "../config.mjs";

export const session = async (req, res) => {
  const schema = req?.schema || "dbo"
  const db = req?.database;

  const pool = await cManager.connectToDB(db);
  const request = pool.request();

  request.input("id_usuario", req?.user_id);
  request.input("clave_servidor", DB_API_KEY)

  request
    .execute(`${schema}.p_traer_datos_usuario`)
    .then((result) => {
      res.status(200).json({ user: result["recordsets"][0][0] });
    })
    .catch((error) => {
      return res.status(400).json({ data: error, message: "Bad request" });
    });
};