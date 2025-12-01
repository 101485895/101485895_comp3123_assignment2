import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/v1/user/signup", form);
      alert("Signup Successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed — user may already exist.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Create Account
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
            margin="normal"
            label="Email"
            name="email"
            value={form.email}
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
            Sign Up
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ marginTop: 1 }}
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
