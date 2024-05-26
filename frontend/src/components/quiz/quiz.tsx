import QuizType from "../../types/Quiz";
import { Link } from "react-router-dom";
import { Card, Heading, Text, Badge } from "@radix-ui/themes";
import QuestionBadge from "./questionBadge";

export default function Quiz({quiz}: {quiz: QuizType}) {
  return (
    <Link to={`/quiz/${quiz.id}`}>
      <Card>
        <Heading>{quiz.title}</Heading>
        <Text>{quiz.description}</Text>
        <br />
        <Badge color="sky">
          {new Date(quiz.createDate).toLocaleDateString()}
        </Badge>{" "}
        <QuestionBadge number={quiz.questions.length} />
      </Card>
    </Link>
  );
}
