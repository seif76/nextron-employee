"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Navbar from "../components/navigation/navbar";
import { useRouter } from "next/navigation";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const router = useRouter();
  const [authinticate, setAuthinticate] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      axios.get('http://localhost:3000/api/auth/jwtAuth', {
        headers: {
          jwt: token
        }
      })
      .then(response => {
        if (response.data.authinticate) {
          setAuthinticate(true);
        } else {
          setAuthinticate(false);
          localStorage.removeItem("jwt");
          router.push("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        router.push("/login");
        setAuthinticate(false);
      });
    } else {
      //localStorage.removeItem("jwt");
      router.push("/login");
    }
  }, []);
  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get-departments");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Add a department
  const addDepartment = async () => {
    if (!newDepartment.trim()) return;

    try {
      await axios.post("http://localhost:3000/api/add-department", { name: newDepartment });
      setNewDepartment("");
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // Edit a department
  const editDepartment = async (id) => {
    if (!updatedName.trim()) return;

    try {
      await axios.put(`http://localhost:3000/api/update-department/${id}`, { name: updatedName });
      setEditingDepartment(null);
      setUpdatedName("");
      fetchDepartments();
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  // Delete a department
  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete-department/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Departments</title>
      </Head>

      {authinticate ? (
        <>
         
      <Navbar />

<div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
  <h1 className="text-3xl font-semibold text-gray-700 mb-6">Departments</h1>

  {/* Add Department Section */}
  <div className="bg-white p-4 rounded-md shadow-md w-full max-w-lg">
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New department name"
        value={newDepartment}
        onChange={(e) => setNewDepartment(e.target.value)}
        className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={addDepartment}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Add
      </button>
    </div>
  </div>

  {/* Departments List */}
  <div className="mt-6 w-full max-w-lg">
    {departments.map((dept) => (
      <div key={dept._id} className="flex justify-between items-center bg-white p-4 rounded-md shadow mb-3">
        {editingDepartment === dept._id ? (
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="border p-2 rounded-md flex-1 mr-2"
          />
        ) : (
          <span className="text-gray-800 text-lg">{dept.name}</span>
        )}

        <div className="flex gap-2">
          {editingDepartment === dept._id ? (
            <button
              onClick={() => editDepartment(dept._id)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingDepartment(dept._id);
                setUpdatedName(dept.name);
              }}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => deleteDepartment(dept._id)}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
        </>
      ) : null }


    </>
  );
}
