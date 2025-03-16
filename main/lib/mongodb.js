import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ;
//MONGODB_URI = 'mongodb://oraclelms56:nqEkz4QDJGm5kiVh@<hostname>/?ssl=true&replicaSet=atlas-bfvn73-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

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
     // useNewUrlParser: true,
     // useUnifiedTopology: true,
    });
    isConnected = true;
  } catch (error) {
    console.log(error);
  } 
}

  export default connectToDataBase; 