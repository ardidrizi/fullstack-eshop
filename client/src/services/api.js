const normalizeBase = (value) => {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed.replace(/\/+$/, "");
};

export const resolveApiBaseUrl = (env = import.meta.env) => {
  const isProduction =
    env?.PROD === true ||
    env?.NODE_ENV === "production" ||
    env?.MODE === "production";

  const configuredUrl = normalizeBase(env?.VITE_API_URL);
  if (configuredUrl) {
    return configuredUrl;
  }

  if (isProduction) {
    const errorMessage =
      "Missing VITE_API_URL in production. Set VITE_API_URL to your backend URL (e.g. https://<render-service>.onrender.com/api).";

    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return "http://localhost:5000";
};

export const API_BASE_URL = resolveApiBaseUrl();
export const PRODUCTS_URL = `${API_BASE_URL}/products`;

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
