import User from "./User"
import Question from "./Question"
import Comment from "./Comment";

export default interface Quiz {
  id: number,
  title: string,
  description: string,
  questions: Question[],
  createDate: Date,
  author: User
  totalViews: number;
  totalPlays: number;
  likes: number;
  comments: Comment[];
  timeInMinutes: number;
}
