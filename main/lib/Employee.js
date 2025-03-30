const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    code: {
      type: String,
      unique: true, 
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    nationalId: {
      type: String,
      unique: true, 
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    insuranceNumber: {
      type: String,
      unique: true, 
      required: true,
    },
    exitDate: {
      type: Date, 
      default: null,
    },
    exitStatus: {
      type: String,
      enum: ["Resignation", "Absence", "Dismissal", "Active"], 
      default: "Active",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department", // ✅ Reference to the Department collection
      required: true,
    },
    originalSalary: {
      type: Number,
      required: true,
    },
    salary: { type: Number, required: true },
  },
  {
    timestamps: true, 
  }
);


const Employee = mongoose.model("employee", EmployeeSchema);

module.exports = Employee;
