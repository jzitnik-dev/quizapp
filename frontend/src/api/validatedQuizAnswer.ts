import isLogedIn from "../utils/logedin";
import QuestionType from "../types/QuestionType";
import ValidatedQuizAnswer from "../types/ValidatedQuizAnswer";
import axiosInstance from "./axios/axiosInstance";

export async function validatedQuizAnswer(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  try {
    const response = await axiosInstance.get("/quiz/answer/" + quizId);

    const question = response.data;
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
  } catch (e: any) {
    if (e.response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error();
    } else if (e.response.status == 404) {
      return;
    }
    throw new Error("Error");
  }
}
