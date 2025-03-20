const mongoose = require("mongoose");

const absentSchema = new mongoose.Schema({
  department: String,
  name: String,
  employeeNo: String,
  date: String, 
});

module.exports = mongoose.model("Absent", absentSchema);
