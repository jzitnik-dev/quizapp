import {
  HoverCard,
  Container,
  Heading,
  Section,
  Callout,
  Flex,
  Box,
  Text,
  Badge,
  Spinner,
  Avatar,
} from "@radix-ui/themes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getShared } from "../../../../api/shareAnswer";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import getProfilePictureUrl from "../../../../api/getProfilePictureUrl";
import UserBadge from "../../../../components/user/UserBadge";

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
                  {finishData?.answers.map((answer: any, index: number) => {
                    return (
                      <Callout.Root
                        color={answer.correct ? "green" : "red"}
                        key={index}
                      >
                        <Callout.Icon>
                          {answer.correct ? <CheckIcon /> : <Cross1Icon />}
                        </Callout.Icon>
                        <Box>
                          <Heading>Otázka: {answer.question.question}</Heading>
                          <Text>
                            <Flex gap="1" align="center">
                              <Text>Vaše odpověď:</Text>
                              {answer.question.type.toString() == "Multiselect"
                                ? JSON.parse(answer.answer).map(
                                    (e: string, index: number) => (
                                      <Badge key={index}>{e}</Badge>
                                    ),
                                  )
                                : answer.answer}
                            </Flex>
                          </Text>
                        </Box>
                      </Callout.Root>
                    );
                  })}
                </Flex>
              </>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
