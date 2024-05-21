export default async function register(
  username: string,
  password: string,
) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/auth/signup";

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
  return await response.text();
}
