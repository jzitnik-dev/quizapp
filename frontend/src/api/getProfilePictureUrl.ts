export default function getProfilePictureUrl(username: string) {
  const path = new URL(import.meta.env.VITE_BACKEND);
  path.pathname = "/api/user/profilepicture/" + encodeURIComponent(username);
  return path.toString();
}
