import Finished from "../../types/Finished";
import { Badge } from "@radix-ui/themes";
import ValidatedQuizAnswer from "../../types/ValidatedQuizAnswer";

export default function FinishedBadge({ finished }: { finished?: Finished }) {
  if (finished === undefined) {
    return null;
  }

  if (finished.finished === true) {
    return (
      <Badge color="green">
        Dokončeno {new Date(finished.date).toLocaleDateString()}
      </Badge>
    );
  }

  return (
    <Badge color="red">
      Nedokončeno {new Date(finished.date).toLocaleDateString()}
    </Badge>
  );
}

export function FinishedBadgeAnswer({
  answer,
}: {
  answer?: ValidatedQuizAnswer;
}) {
  if (answer === undefined) {
    return null;
  }

  if (answer.finished == true) {
    return (
      <Badge color="green">
        Dokončeno {new Date(answer.createDate).toLocaleDateString()}
      </Badge>
    );
  }

  return (
    <Badge color="red">
      Nedokončeno {new Date(answer.createDate).toLocaleDateString()}
    </Badge>
  );
}
