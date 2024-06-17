export default async function getRandomQuiz() {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/random";

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.text() as string;
}
