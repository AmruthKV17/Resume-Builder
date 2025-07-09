import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

const connectDB = async () => {
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB successfully connected: ${connectionInst.connection.db}`);
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export {connectDB};