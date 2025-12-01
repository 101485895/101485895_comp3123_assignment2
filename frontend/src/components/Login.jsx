import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/employees");
    } catch (err) {
      alert("Invalid username or password.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            type="password"
            margin="normal"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            type="submit"
          >
            Login
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ marginTop: 1 }}
            onClick={() => navigate("/signup")}
          >
            Create an Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
