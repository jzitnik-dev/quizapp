import isLogedIn from "../utils/logedin";

export default async function updateProfilePicture(profilePicture: File) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/profilepicture";

  const formData = new FormData();
  formData.append("file", profilePicture);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    body: formData,
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
