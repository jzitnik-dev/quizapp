import isLogedIn from "../utils/logedin";

export default async function removeQuiz(id: number) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz";
  url.searchParams.append("quizId", id.toString());

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error(errorData.message);
    }
    throw new Error(errorData.message || "Error");
  }
}
