import express from "express";
import connectToDataBase from "../lib/mongodb";
import employeeModel from "../lib/employee";
import DepartmentModel from "../lib/department";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                GET ROUTES                                  */
/* -------------------------------------------------------------------------- */

// ✅ Get Employees (with filters + pagination)
router.get("/get-employees", async (req, res) => {
  try {
    await connectToDataBase();

    const { page = 1, limit = 10, departmentId, code, nationalId, phoneNumber } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (departmentId) filter.department = departmentId;
    if (code) filter.code = code;
    if (nationalId) filter.nationalId = nationalId;
    if (phoneNumber) filter.phoneNumber = phoneNumber;

    const employees = await employeeModel.find(filter).skip(skip).limit(limit).exec();
    const totalEmployees = await employeeModel.countDocuments(filter);

    res.status(200).json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// ✅ Get All Employees by Department ID (no pagination)
router.get("/employees/department/:departmentId", async (req, res) => {
  try {
    await connectToDataBase();
    const { departmentId } = req.params;

    const departmentExists = await DepartmentModel.findById(departmentId);
    if (!departmentExists) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    const employees = await employeeModel.find({ department: departmentId });

    res.status(200).json({
      employees,
      totalEmployees: employees.length,
    });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get Employees by Department with Pagination
router.get("/get-employees-withDepartment/:departmentId", async (req, res) => {
  try {
    await connectToDataBase();
    const { departmentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const departmentExists = await DepartmentModel.findById(departmentId);
    if (!departmentExists) {
      return res.status(404).json({ message: "❌ Department not found" });
    }

    const employees = await employeeModel.find({ department: departmentId }).skip(skip).limit(limit);
    const totalEmployees = await employeeModel.countDocuments({ department: departmentId });

    res.status(200).json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: page,
      totalEmployees,
    });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Single Employee by ID
router.get("/employee/:id", async (req, res) => {
  try {
    await connectToDataBase();
    const employee = await employeeModel.findById(req.params.id).populate("department", "name");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    res.status(400).json({ message: "Error fetching employee", error });
  }
});

/* -------------------------------------------------------------------------- */
/*                               POST ROUTES                                  */
/* -------------------------------------------------------------------------- */

// ✅ Add Single Employee
router.post("/add-employee", async (req, res) => {
  try {
    await connectToDataBase();
    const newEmployee = new employeeModel(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(400).json({ message: "Error creating employee", error });
  }
});

// ✅ Add Multiple Employees
router.post("/add-multiple-employees", async (req, res) => {
  try {
    await connectToDataBase();
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: "❌ Invalid input. Provide an array." });
    }

    // Collect unique department IDs
    const departmentIds = [...new Set(employees.map(emp => emp.department))];
    const existingDepartments = await DepartmentModel.find({ _id: { $in: departmentIds } }).lean();
    const departmentSet = new Set(existingDepartments.map(dep => dep._id.toString()));

    // Fetch existing employees to avoid duplicates
    const existingEmployees = await employeeModel.find({
      $or: employees.map(emp => ({
        $or: [
          { code: emp.code },
          { nationalId: emp.nationalId },
          { insuranceNumber: emp.insuranceNumber }
        ]
      }))
    }).lean();

    const duplicateCodes = new Set(existingEmployees.map(emp => emp.code));

    const validEmployees = [];
    const failedEmployees = [];

    for (const emp of employees) {
      if (!departmentSet.has(emp.department)) {
        failedEmployees.push({ ...emp, reason: "❌ Invalid Department ID" });
        continue;
      }

      if (duplicateCodes.has(emp.code)) {
        failedEmployees.push({ ...emp, reason: "⚠️ Duplicate Employee Code" });
        continue;
      }

      validEmployees.push({ insertOne: { document: emp } });
    }

    if (validEmployees.length > 0) {
      await employeeModel.bulkWrite(validEmployees);
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

/* -------------------------------------------------------------------------- */
/*                               PUT ROUTES                                   */
/* -------------------------------------------------------------------------- */

// ✅ Update Single Employee by ID
router.put("/update-employee/:id", async (req, res) => {
  try {
    await connectToDataBase();
    const { id } = req.params;
    const updatedEmployee = await employeeModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
