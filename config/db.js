import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const connectionURI = `${process.env.MONGODB_URI}`

const connect = () => {
    mongoose.connect(connectionURI)
        .then(() => console.log(`DB Connected`))
        .catch((err) => console.error(`ERROR:- DB Connection Failed => ${err.message}`))
}

export {
    connect
}