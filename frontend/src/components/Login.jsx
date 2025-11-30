import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login</h1>

      <form>
        <input placeholder="Email or Username" />
        <input placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;
