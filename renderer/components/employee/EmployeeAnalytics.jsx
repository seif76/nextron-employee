"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const formatNumber = (num) => {
  return num.toLocaleString();
};

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/employee-analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { totalEmployees, totalDepartments, totalSalaries, departmentSalaries } = analyticsData;

  const barData = {
    labels: departmentSalaries.map((dept) => dept.departmentName),
    datasets: [
      {
        label: "Total Salary",
        data: departmentSalaries.map((dept) => dept.totalSalary),
        backgroundColor: "#4caf50",
      },
    ],
  };

  const pieData = {
    labels: ["Employees", "Departments", "Total Salaries"],
    datasets: [
      {
        data: [totalEmployees, totalDepartments, totalSalaries],
        backgroundColor: ["#2196f3", "#ff9800", "#f44336"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Company Analytics Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Total Employees</h2>
          <p className="text-xl font-bold text-blue-500">{formatNumber(totalEmployees)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Total Departments</h2>
          <p className="text-xl font-bold text-green-500">{formatNumber(totalDepartments)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Total Salaries</h2>
          <p className="text-xl font-bold text-red-500">${formatNumber(totalSalaries)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Salary Distribution by Department</h2>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="h-64 relative">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <p className="text-lg font-semibold text-center mt-4">Overall Metrics Distribution</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
