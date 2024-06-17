import Quiz from "../../types/Quiz";
import { Badge } from "@radix-ui/themes";

export default function ViewsBadge({ quiz }: { quiz?: Quiz }) {
  return <Badge color="cyan">{quiz?.totalViews} zhlédnutí</Badge>;
}
