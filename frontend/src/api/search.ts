import Page from "../types/Page";
import axiosInstance from "./axios/axiosInstance";

export default async function search(query: string, page: number) {
  const response = await axiosInstance.get("/discover/search", {
    params: {
      query,
      page: page.toString(),
    },
  });

  return response.data as Page<any>;
}
