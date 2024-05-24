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
  AlertDialog,
  Spinner,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import Quiz from "../../../types/Quiz";
import getQuiz from "../../../api/getQuiz";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "../../../types/User";
import getAuthor from "../../../api/getAuthor";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";
import play, { isPlaying } from "../../../api/play";
import isLogedIn from "../../../utils/logedin";

export default function quiz() {
  const [data, setData] = useState<Quiz>();
  const [author, setAuthor] = useState<User | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();
  const dialog = useRef<HTMLButtonElement>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getQuiz((id || 0) as number);
      setData(res);
      const resAuthor = await getAuthor((id || 0) as number);
      setAuthor(resAuthor);
    })();
    if (!isLogedIn()) {
      navigate("/login")
    }
  }, []);

  async function playHandle() {
    setFetching(true);
    if (await isPlaying()) {
      dialog.current?.click();
      return;
    }
    await newGameHandle();
  }
  async function newGameHandle() {
    const key = await play(id || "");
    navigate(`/play/${id}/?key=${key}`);
  }

  return (
    <Section>
      <AlertDialog.Root onOpenChange={open => setFetching(open)}>
        <AlertDialog.Trigger>
          <Button ref={dialog} style={{ display: "none" }}></Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Probíhající hra</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Na Vašem účtu hra již probíhá! Pokud začněte novou hru, předchozí
            hra se zruší!
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setFetching(false)}
              >
                Zrušit
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={newGameHandle}>
                Začít novou hru
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
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
          <Button size="4" onClick={() => playHandle()} disabled={fetching}>
            {fetching ? <Spinner /> : "Spustit kvíz"}
          </Button>
        </Flex>
      </Container>
    </Section>
  );
}
