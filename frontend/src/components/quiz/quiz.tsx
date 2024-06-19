import QuizType from "../../types/Quiz";
import { Link } from "react-router-dom";
import {
  Card,
  Heading,
  Text,
  Badge,
  Skeleton,
  Flex,
  Box,
} from "@radix-ui/themes";
import QuestionBadge from "./questionBadge";
import { getFinished } from "../../api/getQuiz";
import { useQuery } from "react-query";
import FinishedBadge from "./finishedBadge";
import ViewsBadge from "./viewsBadge";
import { ReactNode } from "react";

export default function Quiz({
  quiz,
  customButton,
}: {
  quiz: QuizType | null;
  customButton?: ReactNode;
}) {
  if (quiz === null) {
    return (
      <Card>
        <Flex align="center" justify="between">
          <Box>
            <Heading color="gray">Odstraněný kvíz</Heading>
            <Text color="gray">Tento kvíz byl odstraněn!</Text>
          </Box>
          {customButton}
        </Flex>
      </Card>
    );
  }

  const { data } = useQuery(
    "finishedQuiz:" + quiz.id,
    async () => await getFinished(quiz.id.toString()),
  );

  return (
    <Link to={`/quiz/${quiz.id}`}>
      <Card>
        <Flex align="center" justify="between">
          <Box>
            <Heading>{quiz.title}</Heading>
            <Text color="gray">{quiz.description}</Text>
            <br />
            <Badge color="sky">
              {new Date(quiz.createDate).toLocaleDateString()}
            </Badge>{" "}
            <QuestionBadge number={quiz.questions.length} />{" "}
            <ViewsBadge quiz={quiz} />{" "}
            <FinishedBadge finished={data} />
          </Box>
          {customButton}
        </Flex>
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
