export default async function getUser(username: string) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user";
  url.searchParams.append("username", username);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.json();
}
