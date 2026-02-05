const normalizeBase = (value) => value.replace(/\/$/, "");
export const API_BASE_URL = normalizeBase(
  import.meta.env.VITE_API_URL || "/api",
);
export const PRODUCTS_URL = normalizeBase(
  import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}/products`,
);

export const getToken = () => localStorage.getItem("token");

export const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};
