import UserProfile from "./UserProfile";

export default interface UserProfileContextType {
  userProfile: UserProfile | null
  setUserProfile: (userProfile: UserProfile | null) => void
  loading: boolean
  error: Error | null
}
