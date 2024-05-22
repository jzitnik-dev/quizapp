import Quiz from "./Quiz";

export default interface User {
  id: number;
  displayName: string;
  username: string;
  bio?: string;
  quizzes: Quiz[];
}
