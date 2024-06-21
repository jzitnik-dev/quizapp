import {
  Container,
  Heading,
  Section,
  Text,
  Flex,
  Spinner,
} from "@radix-ui/themes";
import { useUserProfile } from "../../../../components/header/UserProfileProvider";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getShares } from "../../../../api/getUser";
import AnswersList from "../../../../components/quiz/answersList";

export default function Shares() {
  const { userProfile, loading } = useUserProfile();
  const { username } = useParams();
  const navigate = useNavigate();
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const { data, status: userStatus } = useQuery(
    "usersharelist",
    async () => await getShares(username?.trim() || ""),
    {
      enabled: !isUserNotFound,
      retry: (failureCount, error) => {
        if ((error as any).status === 404) {
          setIsUserNotFound(true);
          return false;
        }
        return failureCount < 3;
      },
    },
  );

  useEffect(() => {
    if (userProfile?.username == username) {
      navigate("/me");
    }
  }, [loading]);

  return (
    <Section>
      <Container>
        <Heading align="center" size="9">
          Sdílené kvízy
        </Heading>
        {isUserNotFound ? (
          <Text as="p" align="center"></Text>
        ) : userStatus === "loading" ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : (
          <Flex direction="column" gap="5" mt="5">
            {data?.map((share) => {
              return (
                <Link to={`/answer/share/${share.shareKey}`}>
                  <Heading size="8">Kvíz: {share.quiz.title}</Heading>
                  <Flex mx="4" direction="column" gap="2" mt="2">
                    <AnswersList answers={share.validatedQuizAnswer.answers} />
                  </Flex>
                </Link>
              );
            })}
          </Flex>
        )}
      </Container>
    </Section>
  );
}
