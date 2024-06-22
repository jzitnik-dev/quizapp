import User from "./User";

export default interface Comment {
  content: string;
  author: User;
  date: Date;
}
