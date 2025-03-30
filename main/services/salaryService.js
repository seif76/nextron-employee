import EmployeeModel from "../lib/employee.js";
import mongoose from "mongoose";

/**
 * ✅ Deduct Salary for Absent Employees (with Debugging)
 */
export const deductSalary = async (absentees) => {
  for (let { code } of absentees) {
    console.log(`Searching for employee with code: ${code}`);

    const employee = await EmployeeModel.findOne({ code });

    if (!employee) {
      console.log(`Employee with code ${code} not found! Skipping.`);
      continue;
    }

    console.log(`Found employee: ${employee.name}, Current Salary: ${employee.salary}`);

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Deduct one day's salary
    const dailySalary = employee.salary / daysInMonth;
    console.log(`Calculated daily salary deduction: ${dailySalary}`);

    employee.salary -= dailySalary;
    await employee.save();

    console.log(`New salary for ${employee.name} (Code: ${code}): ${employee.salary}`);
  }
};
//=================================================================================

/*export const resetSalaries = async () => {
    const today = new Date();
    if (today.getDate() !== 29) return; // Only run on the 26th

    console.log("🔵 Resetting salaries to original values...");

    try {
        const employees = await EmployeeModel.find();

        for (let employee of employees) {
            if (employee.originalSalary !== undefined) {
                console.log(`🟢 Resetting salary for ${employee.name} (Code: ${employee.code})`);
                employee.salary = employee.originalSalary;
                await employee.save();
                console.log(`✅ New salary for ${employee.name}: ${employee.salary}`);
            } else {
                console.log(`⚠️ No original salary found for ${employee.name} (Code: ${employee.code}), keeping current salary.`);
            }
        }

        console.log("✅ Salary reset process completed!");
    } catch (error) {
        console.error("❌ Error resetting salaries:", error);
    }
};*/
  //===================================================================

  /*export const resetSalaries = async () => {
    try {
        const today = new Date();
        if (today.getDate() !== 29) return; // Run only on the 26th

        console.log("🔄 Resetting salaries...");

        const employees = await EmployeeModel.find();

        for (let employee of employees) {
            if (employee.originalSalary) {
                employee.salary = employee.originalSalary;
                await employee.save();
                console.log(`✅ Reset salary for ${employee.name}`);
            }
        }
        console.log("✅ Salary reset complete!");
    } catch (error) {
        console.error("❌ Error resetting salaries:", error);
    }
};*/





const MONGO_URI = "mongodb+srv://hrdb2025:yoTkK1cf4iW6FwVx@cluster0.xil1u.mongodb.net/Hr-db?retryWrites=true&w=majority&appName=Cluster0";

export const resetSalaries = async () => {
    try {
        console.log("Function `resetSalaries` started...");

        if (!mongoose.connection.readyState) {
            console.log("🔌 Connecting to database...");
            await mongoose.connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Database connected.");
        }

        const today = new Date();
        if (today.getDate() !== 26) {
            console.log("Not the 26th, skipping reset.");
            return;
        }

        console.log("Resetting salaries...");
        const employees = await EmployeeModel.find();
        console.log(`👥 Found ${employees.length} employees.`);

        for (let employee of employees) {
            if (employee.originalSalary !== undefined) {
                employee.salary = employee.originalSalary;
                await employee.save(); 
                console.log(`Reset salary for ${employee.name}`);
            } else {
                console.log(`Skipping ${employee.name} (no originalSalary set)`);
            }
        }

        console.log("Salary reset complete!");
    } catch (error) {
        console.error("Error resetting salaries:", error);
    }
};

