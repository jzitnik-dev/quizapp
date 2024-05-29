import Page from "../types/Page";

export default async function search(query: string, page: number) {
  const url = new URL(import.meta.env.VITE_BACKEND);
  url.pathname = "/api/discover/search";
  url.searchParams.append("query", query);
  url.searchParams.append("page", page.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }
  return (await response.json()) as Page<any>;
}
