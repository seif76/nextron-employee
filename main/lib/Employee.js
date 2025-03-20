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
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
