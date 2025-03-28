import express from "express";
import multer from "multer";
import xlsx from "xlsx";

import connectToDataBase from "../lib/mongodb";
import AttendanceModel from "../lib/attendance";

const router = express.Router();

// 🟢 Use Memory Storage (No Need to Save File)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Utility function to parse Excel date/time correctly
const parseExcelDate = (dateValue) => {
  if (!dateValue) return null;

  // Convert Excel serial number to JavaScript Date (if applicable)
  if (typeof dateValue === "number") {
    return new Date((dateValue - 25569) * 86400 * 1000);
  }

  // Convert string date format to Date object
  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// API to Upload File & Process Directly
router.post("/attendance/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  try {
    await connectToDataBase(); // ✅ Ensure DB is connected

    // 🟢 Read file from memory
    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log("✅ First row data:", jsonData[0]); // Debugging

    for (let row of jsonData) {
      const employeeNo = String(row["No."] || row["Employee No"] || "").trim();
      const name = (row["Name"] || "").trim();
      const dateTime = parseExcelDate(row["Date/Time"]);
      const locationId = String(row["Location ID"] || "").trim();

      if (!employeeNo || !dateTime) {
        console.log("⚠️ Skipping invalid row:", row);
        continue;
      }

      // Normalize date (remove time part for comparison)
      const date = new Date(dateTime);
      date.setHours(0, 0, 0, 0);

      // Check if an entry exists for the same employee on the same day
      let attendance = await AttendanceModel.findOne({ employeeNo, date });

      if (!attendance) {
        // First entry of the day -> Store as Check-in
        attendance = new AttendanceModel({
          employeeNo,
          name,
          dateTime,  // ✅ Save the actual check-in time
          checkInTime: dateTime, 
          locationId,
        });
      } else if (!attendance.checkOutTime) {
        // Second entry of the day -> Store as Check-out
        attendance.checkOutTime = dateTime;
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
