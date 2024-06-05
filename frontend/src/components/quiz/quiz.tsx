import QuizType from "../../types/Quiz";
import { Link } from "react-router-dom";
import { Card, Heading, Text, Badge } from "@radix-ui/themes";
import QuestionBadge from "./questionBadge";
import { getFinished } from "../../api/getQuiz";
import { useQuery } from "react-query";

export default function Quiz({ quiz }: { quiz: QuizType }) {
  const { data: finished } = useQuery(
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
        {finished !== undefined ? (
          finished === true ? (
            <Badge color="green">Dokončeno</Badge>
          ) : (
            <Badge color="red">Nedokončeno</Badge>
          )
        ) : null}{" "}
      </Card>
    </Link>
  );
}
