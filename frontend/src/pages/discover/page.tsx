import {
  Section,
  Heading,
  Container,
  Text,
  Button,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import Quiz from "../../types/Quiz";
import QuizEl from "../../components/quiz/quiz";
import { useEffect, useState } from "react";
import Page from "../../types/Page";
import getDiscover from "../../api/getDiscover";
import { Link, useParams } from "react-router-dom";

export default function Discover() {
  const [quizzes, setQuizzes] = useState<Page<Quiz>>();
  const { pagenumber } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getDiscover(pagenumber);
      setQuizzes(res);
    })();
  }, []);

  return (
    <Section position="relative">
      <Container>
        {quizzes === undefined ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : (
          <>
            <Heading size="9">Procházet</Heading>
            {quizzes?.empty ? (
              <Text align="center" as="p" mt="3">
                Tato stránka neexistuje!
              </Text>
            ) : (
              <>
                <Flex direction="column" mt="3" gap="2">
                  {quizzes?.content.map((el) => <QuizEl quiz={el} />)}
                </Flex>
                <Flex align="center" justify="center" mt="5" gap="3">
                  {quizzes.first ? (
                    <Button disabled={true}>Předchozí</Button>
                  ) : (
                    <Link to={`/discover/page/${quizzes.number}`}>
                      <Button>Předchozí</Button>
                    </Link>
                  )}

                  <Text>{`Stránka ${(quizzes?.number || 0) + 1} z ${quizzes?.totalPages}`}</Text>
                  {quizzes.first ? (
                    <Button disabled={true}>Další</Button>
                  ) : (
                    <Link to={`/discover/page/${quizzes.number + 2}`}>
                      <Button>Další</Button>
                    </Link>
                  )}
                </Flex>
              </>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
