import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div>
      <h1>Signup</h1>

      <form>
        <input placeholder="Username" />
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
