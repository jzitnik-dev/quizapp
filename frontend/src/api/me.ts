import isLogedIn from "../utils/logedin";

export default async function me() {
  if (!isLogedIn()) {
    window.location.reload();
  }

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/me";

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.json();
}

export async function meHeader() {
  if (!isLogedIn()) {
    window.location.reload();
  }

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/me/header";

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.json();
}
