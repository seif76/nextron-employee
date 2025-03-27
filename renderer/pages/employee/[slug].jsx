
// "use client";
// import { useEffect, useState } from "react";
// import Head from "next/head";
// import Navbar from "../../components/navigation/navbar";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function EmployeeDetails() {
//     const router = useRouter();
//     const { slug } = router.query; // Get dynamic employee ID
//     const [employee, setEmployee] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [formData, setFormData] = useState({});

//     useEffect(() => {
//         if (slug) {
//             axios.get(`http://localhost:3000/api/employee/${slug}`)
//                 .then((res) => {
//                     setEmployee(res.data);
//                     setFormData(res.data);
//                 })
//                 .catch((err) => console.error("Error fetching employee:", err));
//         }
//     }, [slug]);

//     // ✅ Manually Format Date (DD-MM-YYYY)
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A"; // Handle empty dates
//         const date = new Date(dateString);
//         return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
//     };

//     // ✅ Handle Input Changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // ✅ Handle Update
//     const handleUpdate = async () => {
//         try {
//             await axios.put(`http://localhost:3000/api/update-employee/${slug}`, formData);
//             setEmployee(formData);
//             setEditMode(false);
//         } catch (error) {
//             console.error("Error updating employee:", error);
//         }
//     };

//     if (!employee) {
//         return <p className="text-center mt-10">Loading...</p>;
//     }

//     return (
//         <>
//             <Head>
//                 <title>{employee.name} - Employee Details</title>
//             </Head>
//             <Navbar />

//             {/* ✅ Wider layout & margin to avoid overlapping navbar */}
//             <div className="max-w-6xl mx-auto mt-16 p-8 bg-white shadow-md rounded-md">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6">
//                     {editMode ? (
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name || ""}
//                             onChange={handleInputChange}
//                             className="border p-2 rounded w-full"
//                         />
//                     ) : (
//                         employee.name || "N/A"
//                     )}
//                 </h1>

//                 <div className="grid grid-cols-2 gap-6">
//                     {[
//                         { label: "Code", key: "code" },
//                         { label: "Hire Date", key: "hireDate", type: "date", format: formatDate },
//                         { label: "National ID", key: "nationalId" },
//                         { label: "Phone Number", key: "phoneNumber" },
//                         { label: "Gender", key: "gender" },
//                         { label: "Address", key: "address" },
//                         { label: "Insurance Number", key: "insuranceNumber" },
//                         { label: "Exit Date", key: "exitDate", type: "date", format: formatDate },
//                         { label: "Exit Status", key: "exitStatus" },
//                         { label: "Salary", key: "salary", type: "number" },
//                     ].map(({ label, key, type, format }) => (
//                         <div key={key} className="flex flex-col">
//                             <label className="text-sm font-semibold text-gray-600">{label}</label>
//                             {editMode ? (
//                                 <input
//                                     type={type || "text"}
//                                     name={key}
//                                     value={formData[key] || ""}
//                                     onChange={handleInputChange}
//                                     className="border p-2 rounded"
//                                 />
//                             ) : (
//                                 <p className="p-2 border bg-gray-100 rounded">{format ? format(employee[key]) : employee[key] || "N/A"}</p>
//                             )}
//                         </div>
//                     ))}

//                     {/* ✅ Department Field */}
//                     <div className="flex flex-col col-span-2">
//                         <label className="text-sm font-semibold text-gray-600">Department</label>
//                         {editMode ? (
//                             <input
//                                 type="text"
//                                 name="department"
//                                 value={formData.department?.name || ""}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded"
//                             />
//                         ) : (
//                             <p className="p-2 border bg-gray-100 rounded">{employee.department?.name || "N/A"}</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* ✅ Edit & Save Buttons */}
//                 <div className="flex justify-end mt-6 space-x-4">
//                     {editMode ? (
//                         <>
//                             <button
//                                 onClick={handleUpdate}
//                                 className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
//                             >
//                                 Apply Changes
//                             </button>
//                             <button
//                                 onClick={() => setEditMode(false)}
//                                 className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
//                             >
//                                 Cancel
//                             </button>
//                         </>
//                     ) : (
//                         <button
//                             onClick={() => setEditMode(true)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//                         >
//                             Edit Employee
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }


"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../../components/navigation/navbar";
import axios from "axios";
import { useRouter } from "next/router";

export default function EmployeeDetails() {
    const router = useRouter();
    const { slug } = router.query; // Get dynamic employee ID
    const [employee, setEmployee] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [departments, setDepartments] = useState([]); // Store available departments

    useEffect(() => {
        if (slug) {
            axios.get(`http://localhost:3000/api/employee/${slug}`)
                .then((res) => {
                    setEmployee(res.data);
                    setFormData(res.data);
                })
                .catch((err) => console.error("Error fetching employee:", err));
        }

        // Fetch all departments for dropdown
        axios.get("http://localhost:3000/api/get-departments")
            .then((res) => setDepartments(res.data))
            .catch((err) => console.error("Error fetching departments:", err));
    }, [slug]);

    // ✅ Manually Format Date (DD-MM-YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Handle empty dates
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    // ✅ Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Check if department is selected (because it is an object, not a simple value)
        if (name === "department") {
            setFormData((prevData) => ({
                ...prevData,
                department: { _id: value } // ✅ Ensure it updates as an object
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    
   
    // ✅ Handle Update
    const handleUpdate = async () => {
        try {
            const updateData = {
                ...formData,
                department: formData.department?._id || employee.department?._id // ✅ Send only department ID
            };
    
            const res = await axios.put(`http://localhost:3000/api/update-employee/${employee._id}`, updateData);
            
            if (res.status === 200) {
                alert("Employee updated successfully");
                setEditMode(false);
                fetchEmployee();
            }
           
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };
    const fetchEmployee = async () => {
        await axios.get(`http://localhost:3000/api/employee/${slug}`)
        .then((res) => {
            setEmployee(res.data);
            setFormData(res.data);
        })
        .catch((err) => console.error("Error fetching employee:", err));
    };

    if (!employee) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <>
            <Head>
                <title>{employee.name} - Employee Details</title>
            </Head>
            <Navbar />

            {/* ✅ Wider layout & margin to avoid overlapping navbar */}
            <div className="max-w-6xl mx-auto mt-16 p-8 bg-white shadow-md rounded-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {editMode ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                        />
                    ) : (
                        employee.name || "N/A"
                    )}
                </h1>

                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: "Code", key: "code" },
                        { label: "Hire Date", key: "hireDate", type: "date", format: formatDate },
                        { label: "National ID", key: "nationalId" },
                        { label: "Phone Number", key: "phoneNumber" },
                        { label: "Address", key: "address" },
                        { label: "Insurance Number", key: "insuranceNumber" },
                        { label: "Exit Date", key: "exitDate", type: "date", format: formatDate },
                        { label: "Salary", key: "salary", type: "number" },
                    ].map(({ label, key, type, format }) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600">{label}</label>
                            {editMode ? (
                                <input
                                    type={type || "text"}
                                    name={key}
                                    value={formData[key] || ""}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded caret-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            ) : (
                                <p className="p-2 border bg-gray-100 rounded">{format ? format(employee[key]) : employee[key] || "N/A"}</p>
                            )}
                        </div>
                    ))}

                    {/* ✅ Exit Status Dropdown */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">Exit Status</label>
                        {editMode ? (
                            <select
                                name="exitStatus"
                                value={formData.exitStatus || "Active"}
                                onChange={handleInputChange}
                                className="border p-2 rounded"
                            >
                                {["Resignation", "Absence", "Dismissal", "Active"].map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="p-2 border bg-gray-100 rounded">{employee.exitStatus || "Active"}</p>
                        )}
                    </div>

                    {/* ✅ Department Dropdown */}
                    <div className="flex flex-col ">
                   <label className="text-sm font-semibold text-gray-600">Department</label>
                    {editMode ? (
                     <select
                      name="department"
                      value={formData.department?._id || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      >
                   {departments.map(dept => (
                     <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                     </select>
                     ) : (
                   <p className="p-2 border bg-gray-100 rounded">{employee.department?.name || "N/A"}</p>
                    )}
                </div>

                    {/* ✅ Gender Dropdown */}
                    <div className="flex flex-col col-span-2">
                        <label className="text-sm font-semibold text-gray-600">Gender</label>
                        {editMode ? (
                            <select
                                name="gender"
                                value={formData.gender || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded"
                            >
                                {["Male", "Female"].map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="p-2 border bg-gray-100 rounded">{employee.gender || "N/A"}</p>
                        )}
                    </div>

                    

                </div>

                {/* ✅ Edit & Save Buttons */}
                <div className="flex justify-end mt-6 space-x-4">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                            >
                                Apply Changes
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Edit Employee
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}








