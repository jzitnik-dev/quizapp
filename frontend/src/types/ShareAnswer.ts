import Quiz from "./Quiz";
import User from "./User";
import ValidatedQuizAnswer from "./ValidatedQuizAnswer";

export default interface ShareAnswer {
  validatedQuizAnswer: ValidatedQuizAnswer;
  user: User;
  quiz: Quiz;
}
