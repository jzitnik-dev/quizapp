import QuizType from "../../types/Quiz";
import { Link } from "react-router-dom";
import { Card, Heading, Text, Badge, Skeleton } from "@radix-ui/themes";
import QuestionBadge from "./questionBadge";
import { getFinished } from "../../api/getQuiz";
import { useQuery } from "react-query";
import FinishedBadge from "./finishedBadge";

export default function Quiz({ quiz }: { quiz: QuizType }) {
  const { data } = useQuery(
    "finishedQuiz:" + quiz.id,
    async () => await getFinished(quiz.id.toString()),
  );

  return (
    <Link to={`/quiz/${quiz.id}`}>
      <Card>
        <Heading>{quiz.title}</Heading>
        <Text color="gray">{quiz.description}</Text>
        <br />
        <Badge color="sky">
          {new Date(quiz.createDate).toLocaleDateString()}
        </Badge>{" "}
        <QuestionBadge number={quiz.questions.length} />{" "}
        <FinishedBadge finished={data} />
      </Card>
    </Link>
  );
}

export function QuizSkeleton() {
  return (
    <Card>
      <Heading>
        <Skeleton height="30px" />
      </Heading>
      <Text color="gray" as="p" mt="2">
        <Skeleton height="100px" />
      </Text>
      <Badge color="sky" style={{ height: "20px", width: "70px" }} mt="1">
        <Skeleton />
      </Badge>{" "}
      <Badge color="green" style={{ height: "20px", width: "70px" }} mt="1">
        <Skeleton />
      </Badge>{" "}
    </Card>
  );
}
