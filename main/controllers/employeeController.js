import express from "express";

const router = express.Router();



router.get('/employee' , async (req, res) => {

    res.status(200).json({ name: "seif Amir" , age:"20" });
  });  
  

  export default router; 