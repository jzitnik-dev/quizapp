import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import UserProfile from "./UserProfile.ts";
import UserProfileContextType from "./UserProfileContextType.ts";
import isLogedIn from "../../utils/logedin.ts";
import me from "../../api/me.ts";

const AuthContext = createContext<UserProfileContextType>({
  userProfile: null,
  setUserProfile: () => {},
  loading: false,
  error: null
});

const UserProfileProvider = ({ children }: { children : ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loggedIn = isLogedIn();

  const fetchUserProfile = async () => {
    try {
      const response = await me();
      setUserProfile({
        username: response.username,
        displayName: response.displayName,
        roles: response.roles
      });
      setLoading(false);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile();
    }
  }, [loggedIn]);

  return (
    <AuthContext.Provider value={{userProfile, setUserProfile, loading, error}}>
      {children}
    </AuthContext.Provider>
  );
};

const useUserProfile = () => useContext(AuthContext);

export { UserProfileProvider, useUserProfile };
