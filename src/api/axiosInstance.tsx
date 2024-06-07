import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginInfo } from "../models/loginInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL_LOCAL;

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

let loginInfoString = localStorage.getItem("loginInfo");
let loginInfo: LoginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

let accessToken = loginInfo?.tokenModel?.accessToken || "";
let refreshToken = loginInfo?.tokenModel?.refreshToken || "";

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

axiosPrivate.interceptors.request.use(async (req) => {
  //check loginInfo existed
  if (!loginInfo) {
    loginInfoString = localStorage.getItem("loginInfo");
    loginInfo = JSON.parse(loginInfoString || "null");
    accessToken = loginInfo?.tokenModel?.accessToken || "";
    refreshToken = loginInfo?.tokenModel?.refreshToken || "";
  }
  req.headers.Authorization = `Bearer ${accessToken}`;

  const user = jwtDecode(accessToken);

  const date = new Date();

  // Check if the token is expired
  if (user.exp) {
    const isExpired = user?.exp < date.getTime() / 1000;
    const params = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      // TODO: Recheck
      expires: user?.exp,
    };

    if (!isExpired) {
      return req;
    } else {
      const response = await axiosPublic.post(`/auths/refresh`, params);

      localStorage.setItem("loginInfo", JSON.stringify(response.data));

      req.headers.Authorization = `Bearer ${response.data.accessToken}`;

      // Return the updated request
      return req;
    }
  }
  return req;
});

export { axiosPrivate, axiosPublic };
