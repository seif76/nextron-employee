import express from "express";
import multer from "multer";
import xlsx from "xlsx";

import connectToDataBase from "../lib/mongodb";
import AttendanceModel from "../lib/attendance";
import EmployeeModel from "../lib/employee";

const router = express.Router();

// 🟢 Use Memory Storage (No Need to Save File)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Utility function to parse Excel date/time correctly
const parseExcelDate = (dateValue) => {
  if (!dateValue) return null;

  if (typeof dateValue === "number") {
    return new Date((dateValue - 25569) * 86400 * 1000);
  }

  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// ✅ Utility to calculate overtime hours
const calculateOvertimeHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const durationMs = new Date(checkOut) - new Date(checkIn);
  const totalHours = durationMs / (1000 * 60 * 60);
  const overtime = totalHours > 8 ? totalHours - 8 : 0;
  return Math.round(overtime * 100) / 100; // round to 2 decimal places
};

// ✅ Reset overtime on the 26th of each month
const resetMonthlyOvertimeIfNeeded = async () => {
  const now = new Date();
  if (now.getDate() === 26) {
    await EmployeeModel.updateMany({}, { $set: { overtimeHours: 0, overtimeBonus: 0 } });
    console.log("🔄 Overtime reset for all employees.");
  }
};

// 📥 POST API to upload and process attendance data from Excel
router.post("/attendance/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  try {
    await connectToDataBase();
    await resetMonthlyOvertimeIfNeeded();

    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    for (let row of jsonData) {
      const employeeNo = String(row["No."] || row["Employee No"] || "").trim();
      const name = (row["Name"] || "").trim();
      const dateTime = parseExcelDate(row["Date/Time"]);
      const locationId = String(row["Location ID"] || "").trim();

      if (!employeeNo || !dateTime) {
        console.log("⚠️ Skipping invalid row:", row);
        continue;
      }

      const date = new Date(dateTime);
      date.setHours(0, 0, 0, 0);

      let attendance = await AttendanceModel.findOne({ employeeNo, date });

      if (!attendance) {
        attendance = new AttendanceModel({
          employeeNo,
          name,
          dateTime,
          checkInTime: dateTime,
          locationId,
        });
      } else if (!attendance.checkOutTime) {
        attendance.checkOutTime = dateTime;

        const overtimeHours = calculateOvertimeHours(attendance.checkInTime, attendance.checkOutTime);

        console.log(`🔍 Looking up employee code: ${employeeNo}`);
        const employee = await EmployeeModel.findOne({ code: employeeNo });

        if (employee) {
          const { originalSalary = 0, bonuses = 0, allowance = 0 } = employee;

          const overtimeRate = (((originalSalary + bonuses + allowance) / 30) / 7) * 1.35;
          const overtimeBonus = Math.round(overtimeRate * overtimeHours * 100) / 100;

          const updateResult = await EmployeeModel.findOneAndUpdate(
            { code: employeeNo },
            {
              $inc: {
                overtimeHours: overtimeHours,
                overtimeBonus: overtimeBonus,
              },
            },
            { new: true }
          );

          if (!updateResult) {
            console.warn(`⚠️ Failed to update employee ${employeeNo}`);
          } else {
            console.log(`✅ Updated ${updateResult.code} — OT Hours: ${updateResult.overtimeHours}, Bonus: ${updateResult.overtimeBonus}`);
          }
        } else {
          console.warn(`❌ No employee found with code ${employeeNo}`);
        }
      }

      await attendance.save();
    }

    res.json({ message: "✅ Attendance data successfully uploaded!" });
  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ message: "❌ Error processing file!" });
  }
});

export default router;
