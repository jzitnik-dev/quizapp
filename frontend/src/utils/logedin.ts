export default function isLogedIn() {
  return localStorage.getItem("accessToken") != null;
}
