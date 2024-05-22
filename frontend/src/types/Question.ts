import QuestionType from "./QuestionType";

export default interface Question {
  id?: number;
  question: string;
  type: QuestionType;
  options?: string;
  answer: string
}
