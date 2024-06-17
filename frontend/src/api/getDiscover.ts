import Quiz from "../types/Quiz";
import Page from "../types/Page";
import isLogedIn from "../utils/logedin";

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

export async function getDiscoverUser() {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/discover/test";

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
  });

  if (!response.ok) {
    throw response;
  }
  return (await response.json()) as Quiz[];
}
