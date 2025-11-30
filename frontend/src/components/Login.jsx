import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let temp = {};

    if (!form.emailOrUsername.trim())
      temp.emailOrUsername = "Email or Username is required";

    if (!form.password.trim()) temp.password = "Password is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem("token", "logged-in");
    
    window.location.href = "/employees";
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="emailOrUsername"
            placeholder="Email or Username"
            value={form.emailOrUsername}
            onChange={handleChange}
          />
          {errors.emailOrUsername && (
            <p style={{ color: "red" }}>{errors.emailOrUsername}</p>
          )}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;
