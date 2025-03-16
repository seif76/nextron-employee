import express from "express";

import connectToDataBase from "../lib/mongodb";

const router = express.Router();



router.get('/employee' , async (req, res) => {

    res.status(200).json({ name: "seif Amir" , age:"20" });
  });  

  router.get("/test-db", async (req, res) => {
    try {
      await connectToDataBase();
      res.status(200).json({ message: "✅ Database Connection is Working!" });
    } catch (error) {
      res.status(500).json({ message: "❌ Database Connection Failed!", error });
    }
  });
  
  

  export default router; 