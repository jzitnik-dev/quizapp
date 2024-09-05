import UserDTO from "./User";

export default interface Comment {
  id: number;
  content: string;
  author: UserDTO;
  date: Date;
  likes: number;
}
