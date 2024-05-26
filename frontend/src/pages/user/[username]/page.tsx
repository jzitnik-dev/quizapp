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
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "../../../types/User";
import getUser from "../../../api/getUser";
import { useParams } from "react-router-dom";
import isLogedIn from "../../../utils/logedin";
import me from "../../../api/me";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";
import Quiz from "../../../components/quiz/quiz";

export default function UserPage() {
  const [data, setData] = useState<User | undefined>();
  const [notfound, setNotFound] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();

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
      } catch (e: any) {
        if (e.status == "404") {
          setNotFound(true);
        }
      }
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
          >
            <Avatar
              fallback="R"
              radius="full"
              src={getProfilePictureUrl(username || "")}
              size="9"
              style={{
                height: "auto",
                width: "30%",
                aspectRatio: "1/1",
              }}
            />
            <Card style={{ width: "50%", marginLeft: "20px" }}>
              <Heading size="9">{data?.displayName}</Heading>
              <Flex gap="2">
                <Badge>@{data?.username}</Badge>
                <Badge>{data?.quizzes.length} kvízů</Badge>
              </Flex>
              {data?.bio ? (
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
            {data?.quizzes.map((el) => <Quiz quiz={el} />)}
          </Flex>
        </Container>
      </Section>
    </>
  );
}
