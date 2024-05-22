export default async function getQuiz(id: number) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/quiz/get/" + id;

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return await response.json();
}
