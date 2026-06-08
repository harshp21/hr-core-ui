import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error);
	},
);
