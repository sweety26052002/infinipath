import Axios from "axios";
import { getItemInLocalStorage } from "./localStorage";
import { getValidToken } from "./authService";
const BASE_URL = process.env.REACT_APP_API_URL;

const api = Axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * @description This call is prior checking the user while login, before sending the OTP to check the user is already registered or not, this does not require any token
 */
export const postCallForGetUser = (url: string, payload: unknown) => {
  return Axios.post(BASE_URL + url, payload, {})
    .then((response) => response)
    .catch((error) => {
      return error.response;
    });
};

export const postCall = (url: string, payload: unknown) => {
  const userId = getItemInLocalStorage("localId");
  return api
    .post(BASE_URL + url, payload, {
      headers: {
        Authorization: `Bearer ${getItemInLocalStorage("idToken")}`,
        userid: typeof userId === "number" ? `'${userId}'` : userId,
      },
    })
    .then((response) => {
      if (response?.data?.message?.includes("User authorization has failed")) {
        signOut();
      }
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const putCall = (url: string, payload: unknown) => {
  const userId = getItemInLocalStorage("localId");
  return api
    .put(BASE_URL + url, payload, {
      headers: {
        Authorization: `Bearer ${getItemInLocalStorage("idToken")}`,
        userid: typeof userId === "number" ? `'${userId}'` : userId,
      },
    })
    .then((response) => {
      if (response?.data?.message?.includes("User authorization has failed")) {
        signOut();
      }
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getCall = (url: string) => {
  const userId = getItemInLocalStorage("localId");
  return api
    .get(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${getItemInLocalStorage("idToken")}`,
        userid: typeof userId === "number" ? `'${userId}'` : userId,
      },
    })
    .then((response) => {
      if (response?.data?.message?.includes("User authorization has failed")) {
        signOut();
      }
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const deleteCall = (url: string, payload: unknown) => {
  const userId = getItemInLocalStorage("localId");
  return api
    .delete(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${getItemInLocalStorage("idToken")}`,
        userid: typeof userId === "number" ? `'${userId}'` : userId,
      },
      data: payload, // Include the payload in the data property
    })
    .then((response) => {
      if (response?.data?.message?.includes("User authorization has failed")) {
        signOut();
      }
      return response;
    })
    .catch((error) => {
      console.error("Error in deleteCall:", error);
      return error.response;
    });
};

export const getCallForFaceLogin = (url: string) => {
  return Axios.get(BASE_URL + url, {})
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
};

/**
 * @description Function to sign out the user once the session expires
 */
const signOut = () => {
  alert("Session expired. Please login again.");
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/";
};

/**
 * @description This call is to get user details this does not require any token
 */
export const getCallWithoutAuth = (url: string) => {
  return Axios.get(BASE_URL + url)
    .then((response) => response)
    .catch((error) => {
      console.log(error, "error");
      return error.response;
    });
};
