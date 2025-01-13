export const setItemInLocalStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getItemInLocalStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (value !== null && value !== "undefined" && value !== undefined)
    return JSON.parse(value);
  return "";
};

export const removeItemInLocalStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (value !== null && value !== undefined) sessionStorage.removeItem(key);
};
