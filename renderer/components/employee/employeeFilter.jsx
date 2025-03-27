
// "use client";
// import { useState } from "react";

// export default function EmployeeFilter({ onSearch }) {
//   const [filters, setFilters] = useState({
//     code: "",
//     nationalId: "",
//     phoneNumber: "",
//   });

//   // Handle changes for each filter field
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   // Trigger search only when the button is clicked
//   const handleSearch = () => {
//     onSearch(filters);
//   };

//   // Clear all filters
//   const handleClear = () => {
//     setFilters({ code: "", nationalId: "", phoneNumber: "" });
//     onSearch({ code: "", nationalId: "", phoneNumber: "" });
//   };

//   return (
//     <div className="bg-white shadow-md p-4 rounded-lg mb-4">
//       <h3 className="text-lg font-semibold mb-2">🔎 Search Employees</h3>
      
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {/* Search by Code */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Employee Code</label>
//           <input
//             type="text"
//             name="code"
//             placeholder="Enter Employee Code..."
//             value={filters.code}
//             onChange={handleChange}
//             className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Search by National ID */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">National ID</label>
//           <input
//             type="text"
//             name="nationalId"
//             placeholder="Enter National ID..."
//             value={filters.nationalId}
//             onChange={handleChange}
//             className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Search by Phone Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input
//             type="text"
//             name="phoneNumber"
//             placeholder="Enter Phone Number..."
//             value={filters.phoneNumber}
//             onChange={handleChange}
//             className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>
//       </div>

//       {/* Buttons for Search & Clear */}
//       <div className="mt-4 flex justify-end space-x-2">
//         <button 
//           onClick={handleSearch} 
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//         >
//           Search
//         </button>
//         <button 
//           onClick={handleClear} 
//           className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//         >
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";

export default function EmployeeFilter({ onSearch }) {
  const [filters, setFilters] = useState({
    code: "",
    nationalId: "",
    phoneNumber: "",
  });

  // Handle changes for each filter field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Trigger search only when the button is clicked
  const handleSearch = () => {
    onSearch({ ...filters }); // Use the latest filters state
  };

  // Clear all filters
  const handleClear = () => {
    const clearedFilters = { code: "", nationalId: "", phoneNumber: "" };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">🔎 Search Employees</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search by Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Code</label>
          <input
            type="text"
            name="code"
            placeholder="Enter Employee Code..."
            value={filters.code}
            onChange={handleChange}
            className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Search by National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">National ID</label>
          <input
            type="text"
            name="nationalId"
            placeholder="Enter National ID..."
            value={filters.nationalId}
            onChange={handleChange}
            className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Search by Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter Phone Number..."
            value={filters.phoneNumber}
            onChange={handleChange}
            className="border p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Buttons for Search & Clear */}
      <div className="mt-4 flex justify-end space-x-2">
        <button 
          onClick={handleSearch} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
        <button 
          onClick={handleClear} 
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Clear
        </button>
      </div>
    </div>
  );
}


