import { cManager } from "../databases/connections.mjs"
export const verifyDB = (req, res, next) => {
    const database = req.database
    if(cManager.checkDB(database)){
        next()
    }else{
        return res.status(409).json({"mesage": "Server had a restart, please relog"})
    }
}