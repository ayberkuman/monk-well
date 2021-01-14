import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json",
});

export const headers = {
  "Content-Type": "application/json",
};

export default API;
