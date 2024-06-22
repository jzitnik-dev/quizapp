import Activity from "./Activity";
import Quiz from "./Quiz";
import Role from "./Role";

export default interface User {
  id: number;
  displayName: string;
  username: string;
  bio?: string;
  quizzes: Quiz[];
  roles: Role[];
  activity: Activity[];
}
