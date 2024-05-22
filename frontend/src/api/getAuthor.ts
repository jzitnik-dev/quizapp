export default async function getAuthor(quizId: number) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/author/" + quizId;

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.json();
}
