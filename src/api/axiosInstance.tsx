import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL_LOCAL;

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

const loginInfo = localStorage.getItem("loginInfo");

const loginInfoString = loginInfo ? JSON.parse(loginInfo) : null;

const accessToken = loginInfoString?.accessToken || "";

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

axiosPrivate.interceptors.request.use(async (req) => {
  //check loginInfo existed
  if (!loginInfo) {
    const loginInfo = localStorage.getItem("loginInfo");

    const loginInfoString = loginInfo ? JSON.parse(loginInfo) : null;

    const accessToken = loginInfoString?.accessToken || "";

    req.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }

  const user = jwtDecode(loginInfoString.accessToken);

  const date = new Date();

  // Check if the token is expired
  if (user.exp) {
    const isExpired = user?.exp < date.getTime() / 1000;
    const params = {
      accessToken: loginInfoString?.accessToken,
      refreshToken: loginInfoString?.refreshToken,
      expires: loginInfoString?.expires,
    };

    if (!isExpired) {
      return req;
    } else {
      const response = await axios.post(
        `${BASE_URL}/api/v1/auths/refresh`,
        params
      );

      localStorage.setItem("loginInfo", JSON.stringify(response.data));

      req.headers.Authorization = `Bearer ${response.data.accessToken}`;

      // Return the updated request
      return req;
    }
  }
  return req;
});

export { axiosPrivate, axiosPublic };
