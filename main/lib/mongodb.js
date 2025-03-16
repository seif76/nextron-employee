import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ;

// track the connection
let isConnected = false;
 const connectToDataBase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB connected already");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "Hr-db",
    });
    isConnected = true;
  } catch (error) {
    console.log(error);
  } 
}

  export default connectToDataBase; 