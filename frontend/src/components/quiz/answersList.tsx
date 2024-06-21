import AnswerType from "../../types/Answer";
import Answer from "./answer";

export default function AnswersList({ answers }: { answers: AnswerType[] }) {
  return answers.map((answer, index) => <Answer answer={answer} key={index} />);
}
