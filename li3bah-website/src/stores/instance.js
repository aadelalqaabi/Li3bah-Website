import axios from "axios";

const baseURL = "https://www.cotankw.com/api";
//const baseURL = "http://localhost:8000/api/";

const instance = axios.create({
  baseURL: baseURL,
});

export { instance, baseURL };
