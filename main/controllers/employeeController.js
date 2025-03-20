import express from "express";

import connectToDataBase from "../lib/mongodb";
import EmployeeModel from "../lib/employee";
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

  router.post("/add-employee1", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection

      // ✅ Extract data from query parameters
      const newItem = new EmployeeModel({
        name: req.query.name,
        code: req.query.code,
        hireDate: req.query.hireDate,
        nationalId: req.query.nationalId,
        phoneNumber: req.query.phoneNumber,
        address: req.query.address,
        insuranceNumber: req.query.insuranceNumber,
        department: req.query.department,
        salary: req.query.salary
      });

      const savedItem = await newItem.save(); // Save new item
      res.status(201).json(savedItem  );
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating item", name : req.query.name });
    }
});


  router.post("/add-employee", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const newItem = new EmployeeModel(req.body);
      const savedItem = await newItem.save(); // Save new item
      res.status(201).json(savedItem);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating item" , error });
    }
  });

  router.get("/employee/:id", async (req, res) => {
    try {
        await connectToDataBase(); // Ensure DB connection
        const employee = await EmployeeModel.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error fetching employee", error });
    }
});


  router.post("/add-employee1", async (req, res) => {
    try {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
    } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ error: "Failed to add employee" });
    }
  });
  
  

  export default router; 