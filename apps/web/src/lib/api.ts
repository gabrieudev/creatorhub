import { env } from "@CreatorHub/env/web";
import axios from "axios";

const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_SERVER_URL}/api`,
  withCredentials: true,
});

export default api;
