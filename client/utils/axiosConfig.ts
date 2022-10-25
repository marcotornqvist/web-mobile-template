import axios from "axios";

export default function useInitializeAxios(authorization?: string) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  if (authorization) {
    axios.defaults.headers.common["authorization"] = authorization;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
}
