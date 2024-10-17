import app from "./server.mjs";
import { connectToBridgeDB } from "./databases/bridge_database.mjs";
import { PORT } from './config.mjs';


let server;



server = app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
    connectToBridgeDB()
})
