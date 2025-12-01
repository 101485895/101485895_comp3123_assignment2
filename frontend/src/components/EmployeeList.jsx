import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

function EmployeeList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const { data: employees, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/emp/employees")).data,
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

  const handleNewChange = (e) =>
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });

  const addEmployeeMutation = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
      if (newFile) form.append("profile_picture", newFile);
      await api.post("/emp/employees", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEmployeeMutation.mutate(newEmployee);
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const startEdit = (emp) => {
    setEditForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining?.slice(0, 10),
      department: emp.department,
    });
    setEditingId(emp._id);
    setEditOpen(true);
  };

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
      if (editFile) form.append("profile_picture", editFile);
      await api.put(`/emp/employees/${id}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setEditOpen(false);
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateEmployeeMutation.mutate({ id: editingId, data: editForm });
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id) =>
      api.delete("/emp/employees", { params: { eid: id } }),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee?"))
      deleteEmployeeMutation.mutate(id);
  };

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const viewDetails = (emp) => {
    setSelectedEmployee(emp);
    setDetailsOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Employees</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* SEARCH */}
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Search Employees" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Department"
                value={searchDept}
                onChange={(e) => setSearchDept(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Position"
                value={searchPosition}
                onChange={(e) => setSearchPosition(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4} display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={() => searchQuery.refetch()}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchDept("");
                  setSearchPosition("");
                  queryClient.invalidateQueries(["employees"]);
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* EMPLOYEE TABLE */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Employee List" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Picture</TableCell>
                <TableCell>First</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayEmployees?.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>
                    {emp.profile_picture ? (
                      <Avatar
                        src={`http://localhost:8081/uploads/${emp.profile_picture}`}
                      />
                    ) : (
                      <Avatar />
                    )}
                  </TableCell>
                  <TableCell>{emp.first_name}</TableCell>
                  <TableCell>{emp.last_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.salary}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => viewDetails(emp)}>
                      View
                    </Button>
                    <Button size="small" onClick={() => startEdit(emp)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD EMPLOYEE */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Add Employee" />
        <CardContent>
          <form onSubmit={handleAddSubmit}>
            <Grid container spacing={2}>
              {[
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["email", "Email"],
                ["position", "Position"],
                ["salary", "Salary"],
                ["department", "Department"],
              ].map(([name, label]) => (
                <Grid item xs={12} md={4} key={name}>
                  <TextField
                    name={name}
                    label={label}
                    fullWidth
                    value={newEmployee[name]}
                    onChange={handleNewChange}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={4}>
                <TextField
                  type="date"
                  name="date_of_joining"
                  label="Date of Joining"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={newEmployee.date_of_joining}
                  onChange={handleNewChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button variant="outlined" component="label">
                  Upload Picture
                  <input type="file" hidden onChange={(e) => setNewFile(e.target.files[0])} />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" type="submit">
                  Add Employee
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* EMPLOYEE DETAILS MODAL */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <Box textAlign="center">
                <Avatar
                  src={
                    selectedEmployee.profile_picture
                      ? `http://localhost:8081/uploads/${selectedEmployee.profile_picture}`
                      : ""
                  }
                  sx={{ width: 100, height: 100, margin: "auto" }}
                />
              </Box>

              <Typography>Name: {selectedEmployee.first_name} {selectedEmployee.last_name}</Typography>
              <Typography>Email: {selectedEmployee.email}</Typography>
              <Typography>Position: {selectedEmployee.position}</Typography>
              <Typography>Salary: {selectedEmployee.salary}</Typography>
              <Typography>Department: {selectedEmployee.department}</Typography>
              <Typography>
                Joined: {selectedEmployee.date_of_joining?.slice(0, 10)}
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(editForm).map(([key, value]) => (
                <Grid item xs={12} md={4} key={key}>
                  <TextField
                    name={key}
                    label={key.replace("_", " ").toUpperCase()}
                    fullWidth
                    value={value}
                    type={key === "date_of_joining" ? "date" : undefined}
                    InputLabelProps={key === "date_of_joining" ? { shrink: true } : {}}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [key]: e.target.value })
                    }
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload New Picture
                  <input type="file" hidden onChange={(e) => setEditFile(e.target.files[0])} />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeList;
