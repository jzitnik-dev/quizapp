import isLogedIn from "../utils/logedin";

export default async function updateMe(displayName: string, bio: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/me";

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    body: JSON.stringify({
      displayName: displayName,
      bio: bio,
    }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData);
    }
    throw new Error(errorData || "Registration failed");
  }
  return await response.text();
}

export async function changePassword(
  password: string,
  currentPassword: string,
) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/me/password";

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    body: JSON.stringify({
      password: password,
      currentPassword: currentPassword,
    }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw errorData;
    }
    throw errorData;
  }
  return await response.text();
}
