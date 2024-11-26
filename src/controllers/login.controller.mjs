import jwt from "jsonwebtoken";
import { cManager } from "../databases/connections.mjs";
import { JWT_SECRET, REFRESH_JWT_SECRET, DB_API_KEY } from "../config.mjs";

export const login = async (req, res) => {
  const username = req.body?.username || req.body?.usuario;
  const password = req.body?.password || req.body?.contrasena;
  const id_database = req.body?.id_database || req.body?.id_basedatos;
  const schema = req.body?.schema || req.body?.esquema || "dbo"


  if (typeof username != "string" && typeof password != "string") {
    return res.status(402).json("username and password must be s trings");
  }
  const pool = await cManager.pools.bridge;
  const result = id_database
    ? await pool
        .request()
        .input("identificador_db", id_database)
        .input("clave_api", DB_API_KEY)
        .execute("dbo.p_traer_datos_conexion")
        .catch((error) => {
          return res.status(500).json("Internal Server Error");
        })
    : await pool
        .request()
        .input("usuario", username)
        .input("contrasena", password)
        .execute(`dbo.p_traer_conexion_usuario_autenticar`)
        .catch((error) => {
          return res.status(500).json("Internal Server Error");
        });
  const connectionInfo = result.recordset[0];
  if (connectionInfo.error) {
    return res.status(404).json({
      error: connectionInfo.mensaje,
    });
  }

  const dbConfig = {
    user: connectionInfo.usuario,
    password: connectionInfo.contrasena,
    server: connectionInfo.hospedaje,
    port: parseInt(connectionInfo.puerto),
    database: connectionInfo.base_datos,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };

  const p = await cManager.connectToDB(dbConfig.database, dbConfig);
  p.request()
    .input("usuario", username)
    .input("contrasena", password)
    .input("renglon", "USUARIO")
    .execute(`p_traer_usuario_autenticar`)
    .then((result) => {
      let r = result["recordsets"][0][0];
      const accessToken = jwt.sign(
        {
          username: username,
          user_id: r["id_usuario"],
          database: connectionInfo.base_datos,
          schema: schema
        },
        JWT_SECRET,
        { expiresIn: "15m" }
      );
      res.cookie("Auth", accessToken, { httpOnly: true, secure: true });
      return res.status(200).json({
        message: "Login success",
        user: r,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(402).json({ error: "Bad request" });
    });
};
