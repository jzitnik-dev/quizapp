import Question from "./Question"

export default interface Quiz {
  title: string,
  description: string,
  questions: Question[],
}
