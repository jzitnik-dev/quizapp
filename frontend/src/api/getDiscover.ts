import Quiz from "../types/Quiz";
import Page from "../types/Page";
import axiosInstance from "./axios/axiosInstance";
// import isLogedIn from "../utils/logedin";

interface Params {
  questionCount?: string;
  sortType?: string;
}

export default async function getDiscover(
  page?: string,
  questionAmount?: number,
  sortType?: string,
) {
  const url =
    page === undefined ? "/discover/page/1" : "/discover/page/" + page;
  const params: Params = {};

  if (questionAmount) {
    params["questionCount"] = questionAmount.toString();
  }
  if (sortType) {
    params["sortType"] = sortType;
  }

  const response = await axiosInstance.get(url, {
    params,
  });

  return response.data as Page<Quiz>;
}

// export async function getDiscoverUser() {
//   if (!isLogedIn()) throw new Error("Not loged in!");
//
//   const url = new URL(import.meta.env.VITE_BACKEND);
//   url.pathname = "/api/discover/test";
//
//   const response = await fetch(url.toString(), {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
//     },
//   });
//
//   if (!response.ok) {
//     throw response;
//   }
//   return (await response.json()) as Quiz[];
// }
