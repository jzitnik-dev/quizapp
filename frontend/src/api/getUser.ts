export default async function getUser(username: string) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user";
  url.searchParams.append("username", username);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.json();
}

export async function getFinished(username: string) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/finished";
  url.searchParams.append("username", username);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.json();
}
