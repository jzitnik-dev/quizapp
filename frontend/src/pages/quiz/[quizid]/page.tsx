import {
  Container,
  Heading,
  Section,
  Text,
  Flex,
  Badge,
  HoverCard,
  Avatar,
  Box,
  Button,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Quiz from "../../../types/Quiz";
import getQuiz from "../../../api/getQuiz";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "../../../types/User";
import getAuthor from "../../../api/getAuthor";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";

export default function quiz() {
  const [data, setData] = useState<Quiz>();
  const [author, setAuthor] = useState<User | undefined>();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getQuiz((id || 0) as number);
      setData(res);
      const resAuthor = await getAuthor((id || 0) as number);
      setAuthor(resAuthor);
    })();
  }, []);
  return (
    <Section>
      <Container>
        <Heading size="9">{data?.title}</Heading>
        <Flex my="1" gap="1">
          <Badge color="sky">
            {new Date(
              data?.createDate || new Date().toString(),
            ).toLocaleDateString()}
          </Badge>{" "}
          <Badge color="green">{data?.questions.length} otázek</Badge>
          <HoverCard.Root>
            <HoverCard.Trigger>
              <Badge style={{ cursor: "pointer" }}>
                <Link to={"/user/" + author?.username}>
                  {author?.displayName}
                </Link>
              </Badge>
            </HoverCard.Trigger>
            <HoverCard.Content maxWidth="300px">
              <Link to={"/user/" + author?.username}>
                <Flex gap="4">
                  <Avatar
                    size="3"
                    fallback={author?.displayName[0] || "R"}
                    radius="full"
                    src={getProfilePictureUrl(author?.username || "")}
                  />
                  <Box>
                    <Heading size="3" as="h3">
                      {author?.displayName}
                    </Heading>
                    <Text as="div" size="2" color="gray">
                      @{author?.username}
                    </Text>
                  </Box>
                </Flex>
              </Link>
            </HoverCard.Content>
          </HoverCard.Root>
        </Flex>
        <Text>{data?.description}</Text>
        <Flex justify="center" mt="2">
          <Link to={"/play/" + data?.id}>
            <Button size="4">Spustit kvíz</Button>
          </Link>
        </Flex>
      </Container>
    </Section>
  );
}
