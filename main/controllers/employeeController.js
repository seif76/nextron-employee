import express from "express";

import connectToDataBase from "../lib/mongodb";
import employeeModel from "../lib/employee";
import DepartmentModel from "../lib/department";
const router = express.Router();



// Get All Employees with Pagination
router.get("/get-employees", async (req, res) => {
  try {
      await connectToDataBase();

      // Get query parameters (default: page 1, 10 employees per page)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      // Fetch employees with pagination
      const employees = await employeeModel.find({}).skip(skip).limit(limit).exec();
      const totalEmployees = await employeeModel.countDocuments(); // Get total count

      res.status(200).json({
          employees,
          totalPages: Math.ceil(totalEmployees / limit),
          currentPage: page
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching employees" });
  }
});

router.get("/employees/department/:departmentId", async (req, res) => {
  try {
    await connectToDataBase();

    const { departmentId } = req.params;

    // Validate if the department exists
    const departmentExists = await DepartmentModel.findById(departmentId);
    if (!departmentExists) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    // Fetch all employees in the department
    const employees = await employeeModel.find({ department: departmentId });

    res.status(200).json({
      employees,
      totalEmployees: employees.length
    });

  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

// Get Employees by Department with Pagination

router.get("/get-employees-withDepartment/:departmentId", async (req, res) => {
  try {
    await connectToDataBase();

    const { departmentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate department ID
    const departmentExists = await DepartmentModel.findById(departmentId);
    if (!departmentExists) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    // Fetch employees in the department with pagination
    const employees = await employeeModel.find({ department: departmentId }).skip(skip).limit(limit);
    const totalEmployees = await employeeModel.countDocuments({ department: departmentId });

    res.json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: page,
      totalEmployees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  router.post("/add-employee", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const newItem = new employeeModel(req.body);
      const savedItem = await newItem.save(); // Save new item
      res.status(201).json(savedItem);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating item" , error });
    }
  });

  
// Add Multiple Employees at Once
router.post("/add-multiple-employees", async (req, res) => {
  try {
    await connectToDataBase(); // ✅ Ensure DB connection

    const employees = req.body;
    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: "❌ Invalid input. Provide an array." });
    }

    // ✅ Fetch all department IDs in one query (Avoid multiple findById calls)
    const departmentIds = employees.map(emp => emp.department);
    const existingDepartments = await DepartmentModel.find({ _id: { $in: departmentIds } }).lean();

    // Convert department list to a Set for faster lookups
    const departmentSet = new Set(existingDepartments.map(dept => dept._id.toString()));

    // ✅ Fetch all existing employees in one query to check for duplicates
    const existingEmployees = await employeeModel.find(
      { $or: employees.map(emp => ({ code: emp.code, nationalId: emp.nationalId, insuranceNumber: emp.insuranceNumber })) }
    ).lean();

    const existingEmployeeSet = new Set(existingEmployees.map(emp => emp.code));

    let validEmployees = [];
    let failedEmployees = [];

    for (const emp of employees) {
      if (!departmentSet.has(emp.department)) {
        failedEmployees.push({ ...emp, reason: "❌ Invalid Department ID" });
        continue;
      }

      if (existingEmployeeSet.has(emp.code)) {
        failedEmployees.push({ ...emp, reason: "⚠️ Duplicate Employee Code" });
        continue;
      }

      validEmployees.push({
        insertOne: { document: emp },
      });
    }

    if (validEmployees.length > 0) {
      await employeeModel.bulkWrite(validEmployees); // ✅ Insert all valid employees in **one** operation
    }

    res.status(201).json({
      message: `${validEmployees.length} employees added successfully.`,
      employees: validEmployees.map(e => e.insertOne.document),
      failedEmployees,
    });

  } catch (error) {
    console.error("❌ Error adding employees:", error.message || error);
    res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
  }
});

  router.get("/employee/:id", async (req, res) => {
    try {
        await connectToDataBase(); // Ensure DB connection
        const employee = await employeeModel.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error fetching employee", error });
    }
});
    

  export default router; 