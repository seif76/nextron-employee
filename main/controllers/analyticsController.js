import express from "express";
import connectToDataBase from "../lib/mongodb";
import EmployeeModel from "../lib/employee";
import DepartmentModel from "../lib/department";

const router = express.Router();

// ✅ Get Employee Analytics
router.get("/employee-analytics", async (req, res) => {
  try {
    await connectToDataBase();

    // Count total employees
    const totalEmployees = await EmployeeModel.countDocuments();

    // Calculate total salaries for all employees
    const totalSalaries = await EmployeeModel.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);

    // Count total departments
    const totalDepartments = await DepartmentModel.countDocuments();

    // Get salaries by department
    const salariesByDepartment = await EmployeeModel.aggregate([
      {
        $group: {
          _id: "$department",
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    // Convert department IDs to department names
    const departmentSalaries = await Promise.all(
      salariesByDepartment.map(async (item) => {
        const department = await DepartmentModel.findById(item._id);
        return {
          departmentName: department ? department.name : "Unknown",
          totalSalary: item.totalSalary,
        };
      })
    );

    res.status(200).json({
      totalEmployees,
      totalSalaries: totalSalaries.length ? totalSalaries[0].totalSalary : 0,
      totalDepartments,
      departmentSalaries,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
