import sql from 'mssql'

import { DB_SERVER,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PWD
 } from '../config.mjs'


export const sqlConfig = {
    server: DB_SERVER,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PWD,
    pool: {
        max: 10,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export const connectToBridgeDB = async () => {
    try {
        const pool = sql.connect(sqlConfig)
        console.log("Connection to Bridge Database sucessful")
        return pool
    }
    catch (error){
        console.log("Error connecting to bridge database: ", error)
    }
}


export {sql}