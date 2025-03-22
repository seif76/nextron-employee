const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  department: String,
  name: String,
  employeeNo: String,
  date: String, 
  time: String, 
  type: String, 
  locationId: String,
});

module.exports = mongoose.model("attendance", attendanceSchema);