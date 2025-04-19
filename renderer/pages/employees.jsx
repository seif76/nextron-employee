// "use client";
// import { useEffect, useState } from "react";
// import EmployeeCard from "../components/cards/employeeCard";
// import Sidebar from "../components/navigation/employee/sideBar";
// import Head from "next/head";
// import Navbar from "../components/navigation/navbar";
// import axios from "axios";

// export default function Employees() {
//   const [departments, setDepartments] = useState([]); // Stores all departments (loaded once)
//   const [employees, setEmployees] = useState([]); // Stores employees for the selected department
//   const [selectedDepartment, setSelectedDepartment] = useState(null); // Current department filter

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // ✅ Load departments once on component mount
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/get-departments-with-count");
//         setDepartments(res.data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // ✅ Fetch Employees Based on Selected Department
//   const fetchEmployees = async (departmentId, page = 1) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/get-employees-withDepartment/${departmentId}?page=${page}&limit=10`
//       );
//       setEmployees(res.data.employees);
//       setTotalPages(res.data.totalPages);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   // ✅ Handle Department Selection
//   const handleDepartmentClick = (departmentId) => {
//     setSelectedDepartment(departmentId);
//     fetchEmployees(departmentId);
//   };

//   // ✅ Handle Pagination
//   const handlePageChange = (newPage) => {
//     if (selectedDepartment) {
//       fetchEmployees(selectedDepartment, newPage);
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Employees - Page</title>
//       </Head>

//       {/* Navbar */}
//       <Navbar />

//       <div className="flex h-screen bg-gray-50">
//         {/* Sidebar (Departments List - Loaded Once) */}
//         <div className="w-1/5 bg-gray-100 p-4 border-r shadow-md">
//           <Sidebar departments={departments} onDepartmentClick={handleDepartmentClick} />
//         </div>

//         {/* Employees Section */}
//         <div className="flex-1 p-6 overflow-auto">
//           <h1 className="text-2xl font-bold mb-4">Employees</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {employees.map((emp) => (
//               <EmployeeCard key={emp._id} employee={emp} />
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-6 space-x-4">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
//                 }`}
//               >
//                 Previous
//               </button>

//               <span className="py-2 px-4 border rounded-md bg-gray-100">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }




"use client";
import { useEffect, useState } from "react";
import EmployeeCard from "../components/cards/employeeCard";
import Sidebar from "../components/navigation/employee/sideBar";
import Head from "next/head";
import Navbar from "../components/navigation/navbar";
import EmployeeFilter from "../components/employee/employeeFilter";
import AddEmployee from "../components/employee/AddEmployee";
import axios from "axios";

export default function Employees() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filters, setFilters] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/get-departments-with-count");
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const fetchEmployees = async (departmentId = selectedDepartment, page = 1, filters = {}) => {
    try {
      const res = await axios.get("http://localhost:3000/api/get-employees", {
        params: { departmentId, page, limit: 10, ...filters },
      });
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(departmentId);
    fetchEmployees(departmentId, 1, filters);
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchEmployees(selectedDepartment, 1, newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchEmployees(selectedDepartment, newPage, filters);
  };

  return (
    <>
      <Head>
        <title>Employees</title>
      </Head>

      <Navbar />

      <div className="flex h-screen bg-gray-50">
        <div className="w-1/5 bg-gray-100 p-4 border-r shadow-md">
          <Sidebar departments={departments} onDepartmentClick={handleDepartmentClick} />
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Employees</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Employee
            </button>
          </div>

          <EmployeeFilter onSearch={handleSearch} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.map((emp) => (
              <EmployeeCard key={emp._id} employee={emp} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>
              <span className="py-2 px-4 border rounded-md bg-gray-100">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <AddEmployee
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchEmployees(selectedDepartment, currentPage, filters);
        }}
      />
    </>
  );
}

