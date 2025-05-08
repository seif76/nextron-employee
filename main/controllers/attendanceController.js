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

const OVERTIME_RATE = 50; // 💰 Bonus per hour

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

// ✅ Utility to reset overtime fields on the 26th
const resetMonthlyOvertimeIfNeeded = async () => {
  const now = new Date();
  if (now.getDate() === 26) {
    await EmployeeModel.updateMany({}, { $set: { overtimeHours: 0, overtimeBonus: 0 } });
    console.log("🔄 Overtime hours and bonus reset for all employees.");
  }
};

// API to Upload File & Process Directly
router.post("/attendance/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  try {
    await connectToDataBase();
    await resetMonthlyOvertimeIfNeeded();

    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log("✅ First row data:", jsonData[0]);

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

        await EmployeeModel.findOneAndUpdate(
          { code: employeeNo },
          {
            $inc: {
              overtimeHours: overtimeHours,
              overtimeBonus: overtimeHours * OVERTIME_RATE,
            },
          }
        );
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
