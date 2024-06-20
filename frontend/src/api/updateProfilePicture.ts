import isLogedIn from "../utils/logedin";
import axiosInstance from "./axios/axiosInstance";

export default async function updateProfilePicture(profilePicture: File) {
  if (!isLogedIn()) throw new Error("Not loged in!");

  const formData = new FormData();
  formData.append("file", profilePicture);

  const response = await axiosInstance.post("/user/profilepicture", formData);

  return response.data;
}
