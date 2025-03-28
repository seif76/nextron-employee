const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeNo: {
      type: String,
      ref: "employee", // References 'code' in Employee schema
      required: true,
      index: true, // Indexing for performance
    },
    name: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date, // Storing as a proper Date instead of a string
      required: true,
      index: true, // Indexing for faster date-based queries
    },
    checkInTime: {
      type: Date, // Stores the check-in timestamp
      default: null,
    },
    checkOutTime: {
      type: Date, // Stores the check-out timestamp
      default: null,
    },
    locationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("attendance", attendanceSchema);
