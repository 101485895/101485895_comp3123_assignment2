import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Employees</h1>
      <p>Employee data will appear here.</p>
      <button
        onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
        }}
        >
        Logout
      </button>

    </div>
  );
}

export default EmployeeList;
