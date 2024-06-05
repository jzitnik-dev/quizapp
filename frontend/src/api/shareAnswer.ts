import ValidatedQuizAnswer from "../types/ValidatedQuizAnswer";
import isLogedIn from "../utils/logedin";

export default async function shareAnswer(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = `/api/quiz/answer/${quizId}/share`;

  const response = await fetch(url.toString(), {
    method: "POST",
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
    throw new Error(errorData);
  }
  return await response.text();
}

export async function getShared(key: string) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = `/api/quiz/answer/share/${key}`;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }
  return await response.json() as ValidatedQuizAnswer;
}
