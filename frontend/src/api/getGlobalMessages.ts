import { marked } from "marked";
import GlobalMessage from "../types/GlobalMessage";
import dataAxiosInstance from "./axios/dataAxiosInstance";

export default async function getGlobalMessages() {
  const response = await dataAxiosInstance.get("/globalMessages");

  const data: GlobalMessage[] = response.data;

  for (const globalMessage of data) {
    globalMessage.markdownContent = await marked(globalMessage.markdownContent);
  }

  return data;
}
