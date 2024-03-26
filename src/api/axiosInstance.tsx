import axios from "axios";
import jwtDecode from "jwt-decode";

const BASE_URL = import.meta.env.VITE_VITE_BASE_URL_LOCAL;

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

const loginInfo = localStorage.getItem("loginInfo")
  ? JSON.parse(localStorage.getItem("loginInfo"))
  : null;

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${loginInfo?.accessToken}`,
  },
});

axiosPrivate.interceptors.request.use(async (req) => {
  if (!loginInfo) {
    // eslint-disable-next-line no-const-assign
    loginInfo = localStorage.getItem("loginInfo")
      ? JSON.parse(localStorage.getItem("loginInfo"))
      : null;
    req.headers.Authorization = `Bearer ${loginInfo?.accessToken}`;
  } else {
    req.headers.Authorization = `Bearer ${loginInfo?.accessToken}`;
  }

  const user = jwtDecode(loginInfo.accessToken);
  let date = new Date();

  // Check if the token is expired
  const isExpired = user.exp < date.getTime() / 1000;
  const params = {
    accessToken: loginInfo.accessToken,
    refreshToken: loginInfo.refreshToken,
    expires: loginInfo.expires,
  };

  if (!isExpired) {
    return req;
  } else {
    console.log(req);

    const response = await axios.post(
      `${BASE_URL}/api/v1/auths/refresh`,
      params
    );

    localStorage.setItem("loginInfo", JSON.stringify(response.data));

    req.headers.Authorization = `Bearer ${response.data.accessToken}`;

    // Return the updated request
    return req;
  }
});

export { axiosPrivate, axiosPublic };
