import isLogedIn from "../utils/logedin";
import QuestionType from "../types/QuestionType";
import ValidatedQuizAnswer from "../types/ValidatedQuizAnswer";

export async function validatedQuizAnswer(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/answer/"+quizId;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error();
    } else if (response.status == 404) {
      return;
    }
    throw new Error("Error");
  }
  const question = await response.json();
  if (question.type == "Default") {
    question.type = QuestionType.Default;
  } else if (question.type == "Multiselect") {
    question.type = QuestionType.Multiselect;
  } else if (question.type == "Singleselect") {
    question.type = QuestionType.Singleselect;
  } else if (question.type == "TrueFalse") {
    question.type = QuestionType.TrueFalse;
  }

  return question as ValidatedQuizAnswer;
}
