import Question from "./Question";

export default interface Answer {
  answer: string;
  question: Question;
  correct: boolean
}
