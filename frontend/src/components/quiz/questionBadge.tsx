import { Badge } from "@radix-ui/themes";

export default function QuestionBadge({number}: {number: number}) {
  return (
    <Badge color="green">
      {number == 1
        ? number + " otázka"
        : number >= 2 && number <= 4
          ? number + " otázky"
          : number + " otázek"}
    </Badge>
  );
}
