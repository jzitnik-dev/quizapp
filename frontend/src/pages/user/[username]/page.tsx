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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "../../../types/User";
import getUser from "../../../api/getUser";
import { useParams } from "react-router-dom";
import isLogedIn from "../../../utils/logedin";
import me from "../../../api/me";

export default function UserPage() {
  const [data, setData] = useState<User | undefined>();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (isLogedIn()) {
        const res = await me();
        if (res.username.trim() == username?.trim()) {
          navigate("/me");
          return;
        }
      }

      const res = await getUser(username?.trim() || "");
      setData(res);
    })();
  }, []);

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
              src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
              style={{
                height: "auto",
                width: "30%",
              }}
            />
            <Card style={{ width: "50%", marginLeft: "20px" }}>
              <Heading size="9">{data?.displayName}</Heading>
              <Flex gap="2">
                <Badge>@{data?.username}</Badge>
                <Badge>{data?.quizzes.length} kvízů</Badge>
              </Flex>
              <br />
              {data?.bio ? (
                <>
                  <Quote>{data?.bio}</Quote>
                  <br />
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
            {data?.quizzes.map((el) => (
              <Link to={`/user/${username}/quiz/${el.id}`}>
                <Card>
                  <Heading>{el.title}</Heading>
                  <Text>{el.description}</Text>
                  <br />
                  <Badge color="sky">
                    {new Date(el.createDate).toLocaleDateString()}
                  </Badge>{" "}
                  <Badge color="green">
                    {el.questions.length == 1
                      ? el.questions.length + " otázka"
                      : el.questions.length >= 2 && el.questions.length <= 4
                        ? el.questions.length + " otázky"
                        : el.questions.length + " otázek"}
                  </Badge>
                </Card>
              </Link>
            ))}
          </Flex>
        </Container>
      </Section>
    </>
  );
}
