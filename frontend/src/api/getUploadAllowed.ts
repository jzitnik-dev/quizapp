import dataAxiosInstance from "./axios/dataAxiosInstance";

export default async function getUploadAllowed() {
  const response = await dataAxiosInstance.get("/config/uploadAllowed");

  return response.data;
}
