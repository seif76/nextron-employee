'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hireDate: '',
    nationalId: '',
    phoneNumber: '',
    gender: 'Male',
    address: '',
    insuranceNumber: '',
    department: '',
    originalSalary: '',
    salary: '',
  });

  const [departments, setDepartments] = useState([]);

  const getDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/get-departments');
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (response.data && Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      } else {
        console.warn('Unexpected departments response format:', response.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/add-employee', formData);
      alert('Employee added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee.');
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonDataRaw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      // Normalize headers
      const normalizeHeader = (header) =>
        header.toString().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '');

      const mappedData = jsonDataRaw.map((empRaw) => {
        const emp = {};
        Object.keys(empRaw).forEach((key) => {
          const normalizedKey = normalizeHeader(key);
          emp[normalizedKey] = empRaw[key];
        });

        return {
          name: emp['name'] || '',
          code: emp['code'] || '',
          hireDate: emp['hiredate'] ? new Date(emp['hiredate']) : new Date(),
          nationalId: emp['nationalid']?.toString().trim() || '',
          phoneNumber: emp['phonenumber']?.toString().trim() || '',
          gender: emp['gender'] || 'Male',
          address: emp['address'] || '',
          insuranceNumber: emp['insurancenumber']?.toString().trim() || '',
          department: emp['department'] || '',
          originalSalary: parseFloat(emp['originalsalary']) || 0,
          salary: parseFloat(emp['salary']) || 0,
        };
      });

      try {
        const response = await axios.post('http://localhost:3000/api/add-multiple-employees', mappedData);
        alert(response.data.message || 'Employees uploaded successfully!');
        onClose();
      } catch (err) {
        console.error('Error uploading employee data:', err);
        alert(err.message || '❌ Failed to upload employees.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Employee</h2>
        <form onSubmit={handleAddEmployee} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
            <div className="space-y-4">
              <input name="name" placeholder="Full Name" onChange={handleInputChange} required className="input-style" />
              <input name="code" placeholder="Employee Code" onChange={handleInputChange} required className="input-style" />
              <input type="date" name="hireDate" onChange={handleInputChange} required className="input-style" />
              <input name="nationalId" placeholder="National ID" onChange={handleInputChange} required className="input-style" />
              <input name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required className="input-style" />
              <select name="gender" onChange={handleInputChange} className="input-style">
                <option>Male</option>
                <option>Female</option>
              </select>
              <input name="address" placeholder="Address" onChange={handleInputChange} required className="input-style" />
              <input name="insuranceNumber" placeholder="Insurance Number" onChange={handleInputChange} required className="input-style" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Employment Details</h3>
            <div className="space-y-4">
              <select name="department" onChange={handleInputChange} required className="input-style">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Information</h3>
            <div className="space-y-4">
              <input name="originalSalary" type="number" placeholder="Original Salary" onChange={handleInputChange} required className="input-style" />
              <input name="salary" type="number" placeholder="Current Salary" onChange={handleInputChange} required className="input-style" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-sm">Upload Excel File (optional)</label>
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="text-sm text-gray-700" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Add Employee
            </button>
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
  