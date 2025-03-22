const mongoose = require("mongoose");

// Define Department Schema
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});


module.exports = mongoose.model("department", departmentSchema);
