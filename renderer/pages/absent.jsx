"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navigation/navbar";
import Head from "next/head";

export default function AbsentUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Added Loading State

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload File to Backend
  const handleUpload = async () => {
    if (!file) return setMessage("⚠️ Please select a file!");

    setLoading(true); // 🔹 Show loading state
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
      setLoading(false); // 🔹 Hide loading state when done
    }
  };

  return (
    <>
      <Head>
        <title>Absent Upload - page</title>
      </Head>

      <Navbar />

      {/* <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">📂 Upload Absence File</h3>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="mb-2" />
        <button 
          onClick={handleUpload} 
          disabled={loading} // 🔹 Disable button while loading
          className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div> */}

<div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">📂 Upload Absence File</h3>

    {/* File Upload Button */}
    <label className="block w-full px-4 py-2 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
      Choose File
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="hidden" />
    </label>

    {/* Display Selected File Name */}
    {file && <p className="mt-2 text-sm text-gray-600">📄 {file.name}</p>}

    {/* Upload Button */}
    <button 
      disabled={loading} 
      onClick={handleUpload} 
      className={`w-full mt-4 px-4 py-2 text-white font-semibold rounded-md transition ${
        loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white rounded-full border-t-transparent" viewBox="0 0 24 24"></svg>
          Uploading...
        </div>
      ) : "Upload"}
    </button>

    {/* Message Feedback */}
    {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
  </div>
</div>
    </>
  );
}
