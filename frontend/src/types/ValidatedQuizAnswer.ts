import Answer from "./Answer";

export default interface ValidatedQuizAnswer {
  id: number;
  answers: Answer[];
  finished: boolean;
}
