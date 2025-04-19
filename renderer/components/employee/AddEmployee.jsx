import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    hireDate: '',
    nationalId: '',
    phoneNumber: '',
    gender: 'Male',
    address: '',
    insuranceNumber: '',
    exitDate: '',
    exitStatus: 'Active',
    department: '',
    originalSalary: '',
    salary: ''
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/get-departments');
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/add-employee', form);
      alert('Employee added successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add employee.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-sm mb-1">Full Name</label>
                <input name="name" placeholder="e.g. John Doe" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Employee Code</label>
                <input name="code" placeholder="e.g. EMP12345" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Hire Date</label>
                <input type="date" name="hireDate" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">National ID</label>
                <input name="nationalId" placeholder="e.g. 12345678901234" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Phone Number</label>
                <input name="phoneNumber" placeholder="e.g. +1 555 123 4567" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Gender</label>
                <select name="gender" onChange={handleChange} className="input-style">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Address</label>
                <input name="address" placeholder="e.g. 123 Main St, City" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Insurance Number</label>
                <input name="insuranceNumber" placeholder="e.g. INS-998877" onChange={handleChange} required className="input-style" />
              </div>
            </div>
          </div>

          {/* Employment Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Employment Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-sm mb-1">Exit Date</label>
                <input type="date" name="exitDate" onChange={handleChange} className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Exit Status</label>
                <select name="exitStatus" onChange={handleChange} className="input-style">
                  <option>Active</option>
                  <option>Resignation</option>
                  <option>Absence</option>
                  <option>Dismissal</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Department</label>
                <select name="department" onChange={handleChange} required className="input-style">
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-sm mb-1">Original Salary</label>
                <input name="originalSalary" type="number" placeholder="e.g. 5000" onChange={handleChange} required className="input-style" />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Current Salary</label>
                <input name="salary" type="number" placeholder="e.g. 4500" onChange={handleChange} required className="input-style" />
              </div>
            </div>
          </div>

          {/* Buttons */}
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
