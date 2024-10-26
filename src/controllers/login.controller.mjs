import jwt from "jsonwebtoken";
import { cManager } from "../databases/connections.mjs";
import { JWT_SECRET, REFRESH_JWT_SECRET } from "../config.mjs";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const pool = await cManager.pools.bridge;
  const result = await pool
    .request()
    .input("usuario", username)
    .input("contrasena", password)
    .execute(`dbo.p_traer_conexion_usuario_autenticar`)
    .catch((error) => {
      return res.status(500).json("Internal Server error");
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
          database: connectionInfo.base_datos,
          user_id: r["id_usuario"],
        },
        JWT_SECRET,
        { expiresIn: "15m" }
      );
      res.cookie('Auth', accessToken, {httpOnly: true}) 
      return res.status(200).json({
        message: "Login success",
        user: r,
      });
      // const refreshToken = jwt.sign(
      //   {
      //     username: username,
      //     databaseName: connectionInfo.base_datos,
      //   },
      //   REFRESH_JWT_SECRET,
      //   {expiresIn: '2h'}
      // );
    })
    .catch((err) => {
      return res.status(402).json({ error: "Bad request" });
    });
};
