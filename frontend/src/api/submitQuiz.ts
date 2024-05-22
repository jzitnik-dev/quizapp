import Quiz from "../types/Quiz";
import isLogedIn from "../utils/logedin";

export default async function submitQuiz(quiz: Quiz) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/create";

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    body: JSON.stringify(quiz),
  });
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }
    throw new Error(errorData.message || "Error");
  }
  return await response.json();
}
