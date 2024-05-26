import isLogedIn from "../utils/logedin";

export default async function getQuiz(id: number) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/get/" + id;

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.json();
}

export async function getOwned(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/owned";
  url.searchParams.append("quizId", quizId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.text();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData);
    }
    throw new Error(errorData || "Registration failed");
  }
  return (await response.text()).trim() == "true";
}
