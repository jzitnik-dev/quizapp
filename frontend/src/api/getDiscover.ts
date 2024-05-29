import Quiz from "../types/Quiz";
import Page from "../types/Page";

export default async function getDiscover(
  page?: string,
  questionAmount?: number,
) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname =
    page === undefined ? "/api/discover/page/1" : "/api/discover/page/" + page;

  if (questionAmount) {
    url.searchParams.set("questionCount", questionAmount.toString());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return (await response.json()) as Page<Quiz>;
}
