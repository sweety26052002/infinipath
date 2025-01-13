import { auth } from "../Firebase";
import { getItemInLocalStorage, setItemInLocalStorage } from "./localStorage";

const EXPIRATION_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const isTokenExpired = (): boolean => {
  const expirationTime = getItemInLocalStorage("tokenExpirationTime");
  if (!expirationTime) return true;
  return Date.now() >= parseInt(expirationTime) - EXPIRATION_THRESHOLD;
};

export const refreshIdToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user: unknown) => {
      unsubscribe(); // Unsubscribe from the listener once we have the user
      if (!user) {
        console.error("No authenticated user");
        return reject(new Error("No authenticated user"));
      }

      try {
        const newIdTokenObject = await user.getIdTokenResult(true);
        const newIdToken = newIdTokenObject?.token;
        const userId = newIdTokenObject?.claims?.user_id || user?.uid;
        // console.log("Refreshed token:", newIdToken, userId, newIdTokenObject);
        const newExpirationTime = Date.now() + 3600 * 1000; // Token typically valid for 1 hour
        setItemInLocalStorage("idToken", newIdToken);
        setItemInLocalStorage("localId", userId);
        setItemInLocalStorage(
          "tokenExpirationTime",
          newExpirationTime.toString(),
        );
        resolve(newIdToken);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        reject(error);
      }
    });
  });
};

export const getValidToken = async (): Promise<string> => {
  if (isTokenExpired()) {
    const token = await refreshIdToken();
    return token;
  }
  const token = getItemInLocalStorage("idToken");
  return token;
};
