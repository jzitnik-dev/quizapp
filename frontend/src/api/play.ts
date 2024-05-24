import Question from "../types/Question";
import QuestionType from "../types/QuestionType";
import ValidatedQuizAnswer from "../types/ValidatedQuizAnswer";
import isLogedIn from "../utils/logedin";

export default async function play(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/register";
  url.searchParams.append("quizId", quizId);

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
    throw new Error(errorData || "Registration failed");
  }
  return await response.text();
}

export async function isPlaying() {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/user/me/playing";

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
      return false;
    }
    throw new Error("Error");
  }
  return true;
}

export async function isValid(key: string, quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/isValid";
  url.searchParams.append("key", key);
  url.searchParams.append("quizId", quizId);

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
      return false;
    }
    throw new Error("Error");
  }
  return true;
}

export async function getQuestion(key: string, questionNumber: number) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/question";
  url.searchParams.append("key", key);
  url.searchParams.append("question", questionNumber.toString());

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
      throw new Error("invalidcode");
    } else if (response.status == 403) {
      throw new Error("invalidquestion");
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

  return question as Question;
}

export async function skipQuestion(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/question/skip";
  url.searchParams.append("key", key);

  const response = await fetch(url.toString(), {
    method: "POSt",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error();
    }
    throw new Error("Error");
  }
  if (response.status == 208) {
    return true;
  }
  return false;
}

export async function answerQuestion(key: string, answer: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/question/answer";
  url.searchParams.append("key", key);
  url.searchParams.append("answer", answer);

  const response = await fetch(url.toString(), {
    method: "POSt",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error();
    }
    throw new Error("Error");
  }
  if (response.status == 208) {
    return true;
  }
  return false;
}

export async function finishQuiz(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/question/finish";
  url.searchParams.append("key", key);

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
      throw new Error("invalidcode");
    } else if (response.status == 400) {
      throw new Error("invalidquestion");
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

export async function cancel(key: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/play/question/cancel";
  url.searchParams.append("key", key);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });
  if (!response.ok) {
    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      throw new Error();
    }
    throw new Error("Error");
  }
  return true;
}
