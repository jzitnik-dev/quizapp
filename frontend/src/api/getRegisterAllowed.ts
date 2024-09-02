import dataAxiosInstance from "./axios/dataAxiosInstance";

export default async function getRegisterAllowed() {
  const response = await dataAxiosInstance.get("/config/registerAllowed");

  return response.data;
}
