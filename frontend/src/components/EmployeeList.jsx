import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

function EmployeeList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const { data: employees, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/emp/employees");
      return res.data;
    },
  });

  const [searchDept, setSearchDept] = useState("");
  const [searchPosition, setSearchPosition] = useState("");

  const searchQuery = useQuery({
    queryKey: ["search", searchDept, searchPosition],
    queryFn: async () => {
      const res = await api.get("/emp/search", {
        params: {
          department: searchDept || undefined,
          position: searchPosition || undefined,
        },
      });
      return res.data;
    },
    enabled: false,
  });

  const displayEmployees = searchQuery.data ?? employees;

  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  const [newFile, setNewFile] = useState(null);

  const handleNewChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleNewFile = (e) => {
    setNewFile(e.target.files[0]);
  };

  const addEmployeeMutation = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();
      for (let key in data) form.append(key, data[key]);
      if (newFile) form.append("profile_picture", newFile);
      await api.post("/emp/employees", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
        date_of_joining: "",
        department: "",
      });
      setNewFile(null);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEmployeeMutation.mutate(newEmployee);
  };

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  const [editFile, setEditFile] = useState(null);

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setEditForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining?.slice(0, 10) || "",
      department: emp.department,
    });
    setEditFile(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFile = (e) => {
    setEditFile(e.target.files[0]);
  };

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const form = new FormData();
      for (let key in data) form.append(key, data[key]);
      if (editFile) form.append("profile_picture", editFile);
      await api.put(`/emp/employees/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setEditingId(null);
      setEditFile(null);
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    updateEmployeeMutation.mutate({ id: editingId, data: editForm });
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete("/emp/employees", { params: { eid: id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) deleteEmployeeMutation.mutate(id);
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const viewDetails = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) return <div>Loading employees...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Employees</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Search Employees</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by Department"
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Position"
          value={searchPosition}
          onChange={(e) => setSearchPosition(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <button onClick={() => searchQuery.refetch()} style={{ marginLeft: "10px" }}>
          Search
        </button>
        <button
          onClick={() => {
            setSearchDept("");
            setSearchPosition("");
            queryClient.invalidateQueries(["employees"]);
          }}
          style={{ marginLeft: "10px" }}
        >
          Clear
        </button>
      </div>

      <h2>Employee List</h2>
      {displayEmployees?.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.salary}</td>
                <td>{emp.department}</td>
                <td>
                  {emp.profile_picture ? (
                    <img
                      src={`http://localhost:8081/uploads/${emp.profile_picture}`}
                      alt="Profile"
                      width="50"
                      height="50"
                    />
                  ) : (
                    "None"
                  )}
                </td>
                <td>
                  <button onClick={() => viewDetails(emp)}>View</button>
                  <button onClick={() => startEdit(emp)}>Edit</button>
                  <button onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found.</p>
      )}

      {selectedEmployee && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Employee Details</h2>

          {selectedEmployee.profile_picture && (
            <img
              src={`http://localhost:8081/uploads/${selectedEmployee.profile_picture}`}
              alt="Profile"
              width="120"
              height="120"
            />
          )}

          <p>
            <strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}
          </p>
          <p><strong>Email:</strong> {selectedEmployee.email}</p>
          <p><strong>Position:</strong> {selectedEmployee.position}</p>
          <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
          <p><strong>Department:</strong> {selectedEmployee.department}</p>
          <p><strong>Date of Joining:</strong> {selectedEmployee.date_of_joining?.slice(0, 10)}</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Add Employee</h2>
        <form onSubmit={handleAddSubmit}>
          <input name="first_name" placeholder="First Name" value={newEmployee.first_name} onChange={handleNewChange} />
          <input name="last_name" placeholder="Last Name" value={newEmployee.last_name} onChange={handleNewChange} />
          <input name="email" placeholder="Email" value={newEmployee.email} onChange={handleNewChange} />
          <input name="position" placeholder="Position" value={newEmployee.position} onChange={handleNewChange} />
          <input name="salary" placeholder="Salary" type="number" value={newEmployee.salary} onChange={handleNewChange} />
          <input name="date_of_joining" type="date" value={newEmployee.date_of_joining} onChange={handleNewChange} />
          <input name="department" placeholder="Department" value={newEmployee.department} onChange={handleNewChange} />
          
          <input type="file" name="profile_picture" onChange={handleNewFile} />

          <button type="submit">
            Add Employee
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Edit Employee</h2>
          <form onSubmit={handleEditSubmit}>
            <input name="first_name" placeholder="First Name" value={editForm.first_name} onChange={handleEditChange} />
            <input name="last_name" placeholder="Last Name" value={editForm.last_name} onChange={handleEditChange} />
            <input name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} />
            <input name="position" placeholder="Position" value={editForm.position} onChange={handleEditChange} />
            <input name="salary" placeholder="Salary" type="number" value={editForm.salary} onChange={handleEditChange} />
            <input name="date_of_joining" type="date" value={editForm.date_of_joining} onChange={handleEditChange} />
            <input name="department" placeholder="Department" value={editForm.department} onChange={handleEditChange} />

            <input type="file" name="profile_picture" onChange={handleEditFile} />

            <button type="submit">
              Update
            </button>
            <button type="button" onClick={() => setEditingId(null)} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
