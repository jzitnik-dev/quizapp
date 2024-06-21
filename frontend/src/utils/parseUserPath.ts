import { useUserProfile } from "../components/header/UserProfileProvider";

export default function parseUserPath(username: string) {
  const { userProfile } = useUserProfile();
  if (userProfile && userProfile.username.trim() == username.trim()) {
    return "/me";
  }

  return `/user/${username}`;
}
