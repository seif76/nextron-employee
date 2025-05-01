import express from "express";

const router = express.Router();

import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // Don’t forget to import this!

dotenv.config(); // ✅ Make sure this is at the top!



const isProd = process.env.NODE_ENV === 'production';

const JWT_SECRET = isProd ? 'Sec_2025#7&9ad' : process.env.JWT_SECRET;
const AdminEmail = isProd ? 'seif@gmail.com' : process.env.ADMIN_EMAIL;
const AdminPass = isProd ? '123' : process.env.ADMIN_PASS;

// const JWT_SECRET = process.env.JWT_SECRET;
// const AdminEmail = process.env.ADMIN_EMAIL;
// const AdminPass = process.env.ADMIN_PASS;



// ✅ Get Employee Analytics
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("emial is ::    " +   AdminEmail );

    try {
     
      if (email != AdminEmail ) return res.status(404).json({ message: "User not found" });
  
      // Compare passwords
      
      if (password != AdminPass) return res.status(401).json({ message: "Invalid credentials" });
  
      // Generate JWT
      const token = jwt.sign({ email: email , password: password}, JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging in" });
    }
  });


  
const cookieJwtAuth = (token) => {

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
         // Attach decoded token data to request object
         if (decoded) {
               return true;
             }
        next(); // Proceed to the next middleware or route
      } catch (error) {
       
        return false ;
      }


};

router.get("/jwtAuth",(req,res,next) => {
 
   const token = req.headers.jwt ; 
     
    if (cookieJwtAuth(token) == true) {
    
       res.json({ authinticate: true})
     
    } else {
     res.json({ authinticate: false})
    }

   })
  
export default router;
