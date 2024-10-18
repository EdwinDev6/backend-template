import sql from 'mssql'

export class ConnectionsManager {

    constructor(bconfig) {
        this.pools = {
            others: new Map()
        }
        this._bridgeConfig = bconfig
    }

    connectToBridgeDB = () => {
        if(!this._bridgeConfig){
            throw new Error(`Bridge Database config is empty or invalid`)
        }
        this.pools.bridge = new sql.ConnectionPool(this._bridgeConfig, (err) => {
            if(err) {
                throw new Error(`Error adding the bridge pool to connections manager ${err}`)
            }
            else {
                console.log(`Connections manager added bridge pool`)
            }
        })
        this.pools.bridge.connect()
        .then(() => {
            console.log(`Connection to Bridge Database sucessful`)
        })
        .catch((error => {
            console.log(`Error connecting to bridge pool ${error}`)
        }))
    }

    connectToDB = (name, config) => {
        if(!this.pools.others.has(name)) {
            if(!config) {
                throw new Error(`No config pool given`)
            }
            const pool = new sql.ConnectionPool(config, (err) => {
                if(err) {
                    throw new Error(`Error adding the pool ${name} to connections manager ${err}`)
                }
                else {
                    console.log(`Connections manager added ${name} pool`)
                }
            })  
            const close = pool.close.bind(pool);
            pool.close = (...args) => {
                this.pools.others.delete(name)
                return close(...args)
            }
            this.pools.others.set(name, pool)
        }
        return this.pools.others.get(name);
    }
    
}