import axiosInstance from "./axios/axiosInstance";

export default async function getRandomQuiz() {
  const response = await axiosInstance.get("/quiz/random");
  return response.data as string;
}
