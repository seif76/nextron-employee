import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import connectToDataBase from "../lib/mongodb.js";
import AbsenceModel from "../lib/absent.js";
import { deductSalary } from "../services/salaryService.js"; // ✅ Updated function reference

const router = express.Router();

// 🟢 Use Memory Storage (No Need to Save File)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ✅ Normalize Date (Removes Time Part)
 */
const normalizeDate = (dateValue) => {
  if (!dateValue) return null;

  // Convert Excel serial number to JavaScript Date (if applicable)
  if (typeof dateValue === "number") {
    return new Date((dateValue - 25569) * 86400 * 1000);
  }

  // Convert string date format to Date object
  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

/**
 * ✅ API to Upload Absence File & Store Data
 */
router.post("/absence/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  try {
    await connectToDataBase();
    
    console.log("🔵 Processing uploaded file...");

    // 🟢 Read file from memory
    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log("✅ First row data:", jsonData[0]); // Debugging

    const absentees = [];

    for (let row of jsonData) {
      const name = (row["Name"] || "").trim(); 
      const employeeNo = String(row["No."] || "").trim();
      const date = normalizeDate(row["Date/Time"]);

      if (!employeeNo || !date) {
        console.log(`⚠️ Skipping invalid row: ${JSON.stringify(row)}`);
        continue; // Skip invalid rows
      }

      absentees.push({
        code: employeeNo, // Keeping 'code' to match the schema
        name,
        date,
      });
    }

    if (absentees.length > 0) {
      console.log(`🟢 Inserting ${absentees.length} records into DB...`);
      await AbsenceModel.insertMany(absentees);
      console.log("✅ Data successfully inserted!");

      await deductSalary(absentees); // ✅ Apply salary deductions
    } else {
      console.log("⚠️ No valid absence data found.");
    }

    res.json({ message: "✅ Absence data successfully uploaded!" });

  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ message: "❌ Error processing file!" });
  }
});

export default router;
