import { Container, Flex, Heading, Section } from "@radix-ui/themes";
import { useQuery } from "react-query";
import { getAllFinished } from "../../../api/getQuiz";
import Quiz, { QuizSkeleton } from "../../../components/quiz/quiz";

export default function Finished() {
  const { data, status } = useQuery("finishedList", getAllFinished);

  return (
    <Section>
      <Container>
        <Heading size="9" align="center">
          Dokončené kvízy
        </Heading>

        <Flex mt="5" direction="column" gap="2">
          {status === "loading" || !data ? (
            <>
              <QuizSkeleton />
              <QuizSkeleton />
              <QuizSkeleton />
              <QuizSkeleton />
              <QuizSkeleton />
            </>
          ) : (
            <>
              {data.map((e) => (
                <Quiz key={e.id} quiz={e} />
              ))}
            </>
          )}
        </Flex>
      </Container>
    </Section>
  );
}
