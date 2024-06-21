import {
  Container,
  Heading,
  Section,
  Flex,
  Text,
  Badge,
  Spinner,
} from "@radix-ui/themes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getShared } from "../../../../api/shareAnswer";
import { Link } from "react-router-dom";
import UserBadge from "../../../../components/user/UserBadge";
import AnswersList from "../../../../components/quiz/answersList";

export default function Share() {
  const { id } = useParams();

  const { data, status } = useQuery(
    "sharedQuiz",
    async () => await getShared(id || ""),
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const finishData = data?.validatedQuizAnswer;

  return (
    <Section>
      <Container>
        {status == "loading" ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : (
          <>
            {data == null ? (
              <Heading align="center" size="8">
                Sdílení nebylo nalezeno!
              </Heading>
            ) : (
              <>
                <Heading align="center" size="8">
                  Sdílená odpověď
                </Heading>
                <Text as="p">
                  Uživatel: <UserBadge user={data.user} /> <br />
                  Kvíz:{" "}
                  <Link to={"/quiz/" + data.quiz.id}>
                    <Badge color="plum">{data.quiz.title}</Badge>
                  </Link>
                </Text>
                <Flex direction="column" gap="3" mx="3" mt="4">
                  <AnswersList answers={finishData?.answers || []} />
                </Flex>
              </>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
