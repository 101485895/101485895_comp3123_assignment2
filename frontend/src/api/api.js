import axios from "axios";

const backendURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8081/api/v1";

export const api = axios.create({
  baseURL: backendURL
});