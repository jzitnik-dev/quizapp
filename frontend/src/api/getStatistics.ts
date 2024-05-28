import QuizStats from "../types/QuizStats";
import isLogedIn from "../utils/logedin";

export async function getStatistics(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/statistics";
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
  if (response.status == 204) {
    return null;
  }
  return (await response.json()) as QuizStats;
}
