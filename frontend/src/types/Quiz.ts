import User from "./User"
import Question from "./Question"

export default interface Quiz {
  id: number,
  title: string,
  description: string,
  questions: Question[],
  createDate: Date,
  author: User
}
