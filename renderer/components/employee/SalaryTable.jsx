"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function SalaryTable() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/get-employees?limit=1000");
        setEmployees(res.data.employees);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const calculateFinalSalary = (emp) => {
    return (
      (emp.salary || 0) +
      (emp.allowance || 0) +
      (emp.bonuses || 0) +
      (emp.overtimeBonus || 0) +
      (emp.incentive || 0) -
      (emp.tax || 0) -
      (emp.insuranceValue || 0) -
      (emp.latePenalty || 0) -
      (emp.advance || 0)
    );
  };

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees.map(emp => ({
      Name: emp.name,
      Code: emp.code,
      Salary: emp.salary,
      Allowance: emp.allowance,
      Bonuses: emp.bonuses,
      "Overtime Bonus": emp.overtimeBonus,
      "Overtime Hours": emp.overtimeHours,
      Incentives: emp.incentive,
      Tax: emp.tax,
      Insurance: emp.insuranceValue,
      "Late Penalty": emp.latePenalty,
      Advances: emp.advance,
      "Final Salary": calculateFinalSalary(emp).toFixed(2),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaries");
    XLSX.writeFile(workbook, "employee_salaries.xlsx");
  };

  const totalFinalSalaries = employees.reduce((sum, emp) => sum + calculateFinalSalary(emp), 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Salary Table</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={downloadAsExcel}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Download as Excel
        </button>
        <h2 className="text-xl font-semibold">Total Salaries: ${totalFinalSalaries.toFixed(2)}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Allowance</th>
              <th className="px-4 py-2 text-left">Bonuses</th>
              <th className="px-4 py-2 text-left">Overtime Bonus</th>
              <th className="px-4 py-2 text-left">Overtime Hours</th>
              <th className="px-4 py-2 text-left">Incentives</th>
              <th className="px-4 py-2 text-left">Tax</th>
              <th className="px-4 py-2 text-left">Insurance</th>
              <th className="px-4 py-2 text-left">Late Penalty</th>
              <th className="px-4 py-2 text-left">Advances</th>
              <th className="px-4 py-2 text-left">Final Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.code}</td>
                <td className="px-4 py-2 text-green-600">{emp.salary}</td>
                <td className="px-4 py-2 text-green-600">{emp.allowance}</td>
                <td className="px-4 py-2 text-green-600">{emp.bonuses}</td>
                <td className="px-4 py-2 text-green-600">{emp.overtimeBonus}</td>
                <td className="px-4 py-2">{emp.overtimeHours}</td>
                <td className="px-4 py-2 text-green-600">{emp.incentive}</td>
                <td className="px-4 py-2 text-red-600">{emp.tax}</td>
                <td className="px-4 py-2 text-red-600">{emp.insuranceValue}</td>
                <td className="px-4 py-2 text-red-600">{emp.latePenalty}</td>
                <td className="px-4 py-2 text-red-600">{emp.advance}</td>
                <td className="px-4 py-2 font-semibold">${calculateFinalSalary(emp).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
