const mongoose = require("mongoose");

const absenceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      ref: "employee", // References 'code' in Employee schema
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("absence", absenceSchema);
