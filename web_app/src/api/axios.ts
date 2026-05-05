import axios from "axios";

const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string) || "http://localhost:8080/api",
});

const publicEndpoints = ["/auth/login", "/auth/signup", "/auth/introspect"];

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  const token = localStorage.getItem("token");
  const url = config.url || "";

  const isPublic = publicEndpoints.some((endpoint) =>
    url.startsWith(endpoint)
  );

  if (isPublic) {
    delete config.headers.Authorization;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (err?.response?.data) {
      return Promise.reject(err.response.data);
    }

    return Promise.reject({
      code: 500,
      message: err?.message || "Unknown error",
    });
  },
);

export default api;
