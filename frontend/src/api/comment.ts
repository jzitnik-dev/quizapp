import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export async function deleteComment(quizId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.delete("/quiz/comment", {
    params: {
      quizId,
    },
  });

  return true;
}

export async function submitComment(quizId: string, comment: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  await axiosInstance.post("/quiz/comment", {
    quizId,
    content: comment,
  });
}

export async function liked(commentId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.get("/quiz/comment/liked", {
    params: {
      commentId,
    },
  });

  return response.data as boolean;
}

export async function like(commentId: string) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const response = await axiosInstance.post(
    "/quiz/comment/like",
    {},
    {
      params: {
        commentId,
      },
    },
  );
  
  return response.data as boolean;
}
