import { cManager } from "../databases/connections.mjs";

export const session = async (req, res) => {
  const { user, database } = req;
  const pool = await cManager.connectToDB(database);
  pool
    .request()
    .execute()
    .then((result) => {
      return res.status(200).json({ result: result });
    })
    .catch((err) => {
      return res.status(500).json({ err });
    });
};
