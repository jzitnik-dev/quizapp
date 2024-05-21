export default async function login(username: string, password: string) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/auth/signin";

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.json();
}
