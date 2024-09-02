import Role from "../../types/Role";

export default interface UserProfile {
  username: string;
  displayName: string;
  roles: Role[]
}
