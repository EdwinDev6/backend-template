import {cManager} from '../databases/connections.mjs';
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const pool = await cManager.pools.bridge;
    const result = await pool
      .request()
      .input("usuario", username)
      .input("contrasena", password)
      .execute("p_traer_conexion_usuario_autenticar");
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
    await cManager.connectToDB(dbConfig.database, dbConfig);
    req.session.visited = true;
    req.session.user = {
      id: "",
      user: username,
      db: connectionInfo.base_datos,
    }
    return res.status(200).json({ message: "Login success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
