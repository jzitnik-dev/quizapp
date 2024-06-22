import Question from "../types/Question";
import QuestionType from "../types/QuestionType";
import ValidatedQuizAnswer from "../types/ValidatedQuizAnswer";
import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";
import Quiz from "../types/Quiz";

export default async function play(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post(
    "/play/register",
    {},
    {
      params: {
        quizId,
      },
    },
  );

  return response.data;
}

export async function isPlaying() {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/user/me/playing");
  return response.data as Quiz | false;
}

export async function isValid(key: string, quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/play/isValid", {
    params: {
      key,
      quizId,
    },
  });

  return response.data;
}

export async function getQuestion(key: string, questionNumber: number) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  try {
    const response = await axiosInstance.get("/play/question", {
      params: {
        key,
        question: questionNumber.toString(),
      },
    });

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

    return question as Question;
  } catch (error: any) {
    if (error.response.status == 404) {
      throw new Error("invalidcode");
    } else if (error.response.status == 403) {
      throw new Error("invalidquestion");
    }
    throw new Error("Error");
  }
}

export async function skipQuestion(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post(
    "/play/question/skip",
    {},
    {
      params: {
        key,
      },
    },
  );

  if (response.status == 208) {
    return true;
  }
  return false;
}

export async function answerQuestion(key: string, answer: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post(
    "/play/question/answer",
    {
      answer
    },
    {
      params: {
        key,
      },
    },
  );
  if (response.status == 208) {
    return true;
  }
  return false;
}

export async function finishQuiz(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  try {
    const response = await axiosInstance.get("/play/question/finish", {
      params: {
        key,
      },
    });

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
  } catch (error: any) {
    if (error.response.status == 404) {
      throw new Error("invalidcode");
    } else if (error.response.status == 400) {
      throw new Error("invalidquestion");
    }
    throw new Error("Error");
  }
}

export async function cancel(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.post(
    "/play/question/cancel",
    {},
    {
      params: {
        key,
      },
    },
  );

  return true;
}
