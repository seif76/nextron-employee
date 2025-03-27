import express from "express";

import connectToDataBase from "../lib/mongodb";
import DepartmentModel from "../lib/department";
import employeeModel from "../lib/employee";
const router = express.Router();





router.post("/add-department", async (req, res) => {
    try {
      await connectToDataBase();
      const newDepartment = new DepartmentModel(req.body);
      const savedDepartment = await newDepartment.save();
      res.status(201).json(savedDepartment);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating department", error });
    }
  });

  router.get("/get-departments", async (req, res) => {
    try {
      
      await connectToDataBase();    
      const items = await DepartmentModel.find({}).exec();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching items" });
    }
  });


  
// ✅ Update department
router.put("/update-department/:id", async (req, res) => {
    try {
      await connectToDataBase();
      const updatedDept = await DepartmentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedDept);
    } catch (error) {
      res.status(500).json({ message: "Error updating department" });
    }
  });
  
  // ✅ Delete department
  router.delete("/delete-department/:id", async (req, res) => {
    try {
      await connectToDataBase();
      await DepartmentModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting department" });
    }
  });

router.get("/get-departments-with-count", async (req, res) => {
    try {
      await connectToDataBase();
  
      // Get all departments
      const departments = await DepartmentModel.find().lean();
  
      // Count employees per department
      const departmentCounts = await employeeModel.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } }
      ]);
  
      // Convert to an object { departmentId: count }
      const countsMap = departmentCounts.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr.count;
        return acc;
      }, {});
  
      // Attach counts to departments
      const departmentsWithCount = departments.map((dept) => ({
        ...dept,
        employeeCount: countsMap[dept._id.toString()] || 0,
      }));
  
      res.status(200).json(departmentsWithCount);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  export default router; 