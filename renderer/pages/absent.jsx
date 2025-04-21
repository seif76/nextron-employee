import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navigation/navbar";
import Head from "next/head";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AbsentUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyAbsences, setMonthlyAbsences] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("⚠️ Please select a file!");
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/api/absence/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setMessage("❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAbsences = async () => {
    if (!selectedMonth) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/absence/by-month?month=${selectedMonth}`
      );
      setMonthlyAbsences(response.data.employees || []);
      setDaysInMonth(response.data.days || []);
    } catch (err) {
      console.error("❌ Failed to fetch monthly absences:", err);
    }
  };

  const downloadExcel = () => {
    const tableData = monthlyAbsences.map((emp) => {
      const row = {
        Name: emp.name,
        Code: emp.code,
      };
      daysInMonth.forEach((day) => {
        const formatted = dayjs(day).format("D");
        row[formatted] = emp.absences[day] ? "❌" : "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absences");

    const fileName = `Absence_${selectedMonth}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
  };

  return (
    <>
      <Head>
        <title>Absent Upload - Page</title>
      </Head>

      <Navbar />

      <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">📂 Upload Absence File</h3>

          <div className="flex justify-between items-center gap-4 flex-wrap">
            <label className="flex-grow block px-4 py-2 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
              Choose File
              <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              disabled={loading}
              onClick={handleUpload}
              className={`flex-grow px-4 py-2 text-white font-semibold rounded-md transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {file && <p className="mt-2 text-sm text-gray-600 text-center">📄 {file.name}</p>}
          {message && <p className="mt-3 text-sm text-gray-700 text-center">{message}</p>}
        </div>

        {/* 📅 Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-5xl">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">📅 Filter by Month</h4>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            />
            <button
              onClick={fetchMonthlyAbsences}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Filter by Month
            </button>
            {monthlyAbsences.length > 0 && (
              <button
                onClick={downloadExcel}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                📥 Download Excel
              </button>
            )}
          </div>
        </div>

        {/* 📋 Excel-like Absence Table */}
        {Array.isArray(monthlyAbsences) &&
          monthlyAbsences.length > 0 &&
          Array.isArray(daysInMonth) &&
          daysInMonth.length > 0 && (
            <div className="bg-white shadow-md rounded-lg mt-6 overflow-auto w-full max-w-7xl">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 border sticky left-0 bg-gray-200 z-20">#</th>
                    <th className="px-3 py-2 border sticky left-10 bg-gray-200 z-20">Name</th>
                    <th className="px-3 py-2 border sticky left-40 bg-gray-200 z-20">Code</th>
                    {daysInMonth.map((day, idx) => (
                      <th key={idx} className="px-2 py-2 border text-center bg-gray-200">
                        {dayjs(day).format("D")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyAbsences.map((emp, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border sticky left-0 bg-white z-10">{index + 1}</td>
                      <td className="px-3 py-2 border sticky left-10 bg-white z-10">{emp.name}</td>
                      <td className="px-3 py-2 border sticky left-40 bg-white z-10">{emp.code}</td>
                      {daysInMonth.map((day, i) => (
                        <td key={i} className="px-2 py-1 border text-center">
                          {emp.absences[day] ? "❌" : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </>
  );
}
