import axios from "axios";

//const baseURL = "https://www.cotankw.com/api"; //Prod
const baseURL = "http://localhost:8000/api"; //Dev

const instance = axios.create({
  baseURL: baseURL,
});

export { instance, baseURL };
