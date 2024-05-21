import isLogedIn from "../utils/logedin";

export default async function updateMe(
  username: string,
  displayName: string,
  bio: string,
) {
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
      username: username,
      displayName: displayName,
      bio: bio,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
     if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }   if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.text();
}
