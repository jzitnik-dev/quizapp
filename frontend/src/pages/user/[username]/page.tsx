import {
  Container,
  Section,
  Flex,
  Avatar,
  Heading,
  Card,
  Badge,
  Quote,
  Text,
  Skeleton,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import User from "../../../types/User";
import getUser, { getFinished } from "../../../api/getUser";
import { useParams } from "react-router-dom";
import isLogedIn from "../../../utils/logedin";
import me from "../../../api/me";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";
import Quiz from "../../../components/quiz/quiz";
import RolesBadge from "../../../components/user/RolesBadge";

export default function UserPage() {
  const [data, setData] = useState<User | undefined>();
  const [notfound, setNotFound] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [finished, setFinished] = useState();
  const { username } = useParams();
  const navigate = useNavigate();

  const quizzesReverse = useMemo(() => {
    if (data && data.quizzes) {
      return [...data.quizzes].reverse();
    }
    return [];
  }, [data?.quizzes]);

  useEffect(() => {
    (async () => {
      if (isLogedIn()) {
        const res = await me();
        if (res.username.trim() == username?.trim()) {
          navigate("/me", {
            replace: true,
          });
          return;
        }
      }
      try {
        const res = await getUser(username?.trim() || "");
        setData(res);
        const finished = await getFinished(username?.trim() || "");
        setFinished(finished);
      } catch (e: any) {
        if (e.status == "404") {
          setNotFound(true);
        }
      }
      setFetching(false);
    })();
  }, []);

  if (notfound) {
    return (
      <Section>
        <Container>
          <Heading size="9" align="center">
            Nenalezeno!
          </Heading>
          <Text align="center" style={{ display: "block" }}>
            Uživatel nebyl nalezen.
          </Text>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section>
        <Container>
          <Flex
            width="60%"
            justify="center"
            align="center"
            style={{ width: "100%" }}
            className="flex-col gap-4 md:flex-row"
          >
            <Avatar
              fallback={data?.username[0] || "U"}
              radius="full"
              src={getProfilePictureUrl(data?.username || "")}
              size="9"
              style={{
                height: "auto",
                aspectRatio: "1/1",
              }}
              className="w-3/4 sm:w-1/2 md:w-1/3"
            />
            <Card className="w-5/6 md:w-1/2">
              <Heading size="9">
                {fetching ? (
                  <Skeleton height="50px" width="250px" />
                ) : (
                  data?.displayName
                )}
              </Heading>
              <Flex gap="2">
                {fetching || !data?.roles ? null : (
                  <RolesBadge roles={data?.roles} />
                )}
                <Badge>
                  {fetching ? (
                    <Skeleton height="20px" width="60px" />
                  ) : (
                    `@${data?.username}`
                  )}
                </Badge>
                <Badge>
                  {fetching ? (
                    <Skeleton height="20px" width="50px" />
                  ) : data?.quizzes.length == 1 ? (
                    data.quizzes.length + " kvíz"
                  ) : (data?.quizzes.length || 0) >= 2 &&
                    (data?.quizzes.length || 0) <= 4 ? (
                    data?.quizzes.length + " kvízy"
                  ) : (
                    data?.quizzes.length + " kvízů"
                  )}
                </Badge>
                <Badge color="green">
                  Dokončil{" "}
                  {fetching ? (
                    <Skeleton height="20px" width="50px" />
                  ) : finished == 1 ? (
                    finished + " kvíz"
                  ) : (finished || 0) >= 2 && (finished || 0) <= 4 ? (
                    finished + " kvízy"
                  ) : (
                    finished + " kvízů"
                  )}
                </Badge>
              </Flex>

              {fetching ? (
                <Skeleton height="118px" />
              ) : data?.bio ? (
                <>
                  <br />
                  <Quote>{data?.bio}</Quote>
                </>
              ) : null}
            </Card>
          </Flex>
        </Container>
      </Section>
      <Section>
        <Heading align="center" size="9">
          Kvízy
        </Heading>
        <Container p="8">
          <Flex direction="column" gap="3" align="center">
            {data?.quizzes.length != 0 ? (
              quizzesReverse.map((el, index) => <Quiz quiz={el} key={index} />)
            ) : (
              <Heading align="center">
                Uživatel {data?.displayName} nemá zatím žádné kvízy.
              </Heading>
            )}
          </Flex>
        </Container>
      </Section>
    </>
  );
}
