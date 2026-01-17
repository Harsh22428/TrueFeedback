import mongoose from "mongoose";
import { DB_NAME } from "./dbname";
import { error } from "console";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


// void is different from the C++ because here it means that mujhe koi fark nhi padhta hai ki hya respone ayege
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }
    const MONGODB_URI=process.env.MONGODB_URI
    if(!MONGODB_URI){
     throw new Error("MOngo Uri is missing")
    }
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}` || '', {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database");
    }
    catch (error) {
        console.log("Database Connection failed", error)
        process.exit(1);
    }

}
export default dbConnect;