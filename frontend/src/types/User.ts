import Quiz from "./Quiz";

export default interface User {
  displayName: string;
  username: string;
  bio?: string;
  quizzes: Quiz[];
}
