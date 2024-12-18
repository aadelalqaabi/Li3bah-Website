import axios from "axios";

const baseURL = "http://15.185.147.180:8000";

const instance = axios.create({
  baseURL: baseURL,
});

export { instance, baseURL };
