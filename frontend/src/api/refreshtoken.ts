export async function refreshToken() {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/auth/refreshtoken";

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: "aba7aac4-2dd6-49ae-9715-d0f24e454b66"
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  return await response.json();
}
