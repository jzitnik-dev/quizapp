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
  Callout,
} from "@radix-ui/themes";
import { useEffect, useRef, useState, useMemo } from "react";
import Quiz from "../../../types/Quiz";
import getQuiz, { getOwned } from "../../../api/getQuiz";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "../../../types/User";
import getAuthor from "../../../api/getAuthor";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";
import play, { isPlaying } from "../../../api/play";
import isLogedIn from "../../../utils/logedin";
import { validatedQuizAnswer } from "../../../api/validatedQuizAnswer";
import ValidatedQuizAnswer from "../../../types/ValidatedQuizAnswer";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import QuestionBadge from "../../../components/quiz/questionBadge";

export default function quiz() {
  const [data, setData] = useState<Quiz>();
  const [author, setAuthor] = useState<User | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();
  const dialog = useRef<HTMLButtonElement>(null);
  const [fetching, setFetching] = useState(false);
  const [notfound, setNotFound] = useState(false);
  const [answer, setAnswer] = useState<ValidatedQuizAnswer | undefined>();
  const [owned, setOwned] = useState<boolean>();

  const sortedQuestions = useMemo(() => {
    if (data && data.questions) {
      return [...data.questions].sort((a, b) => (a?.id || 0) - (b?.id || 0));
    }
    return [];
  }, [data?.questions]) as any;

  useEffect(() => {
    if (!isLogedIn()) {
      navigate("/login");
    }
    (async () => {
      try {
        const res = await getQuiz((id || 0) as number);
        setData(res);
        const resAuthor = await getAuthor((id || 0) as number);
        setAuthor(resAuthor);
        const answer = await validatedQuizAnswer(id || "");
        setAnswer(answer);
        const owned = await getOwned(id || "");
        setOwned(owned);
        console.log(owned);
      } catch (e: any) {
        if (e.status == 404) {
          setNotFound(true);
        }
      }
    })();
  }, []);

  async function playHandle() {
    setFetching(true);
    if (await isPlaying()) {
      dialog.current?.click();
    } else {
      await newGameHandle();
    }
  }
  async function newGameHandle() {
    if (await validatedQuizAnswer(id || "")) {
      toast.error("Tento kvíz je již odehraný!");
      return;
    }
    const key = await play(id || "");
    navigate(`/play/${id}/?key=${key}`);
  }

  return (
    <Section>
      {notfound ? (
        <>
          <Heading size="9" align="center">
            Nenalezeno!
          </Heading>
          <Text align="center" as="p" size="6">
            Kvíz nebyl nalezen!
          </Text>
        </>
      ) : (
        <>
          <AlertDialog.Root onOpenChange={(open) => setFetching(open)}>
            <AlertDialog.Trigger>
              <Button ref={dialog} style={{ display: "none" }}></Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Probíhající hra</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Na Vašem účtu hra již probíhá! Pokud začněte novou hru,
                předchozí hra se zruší!
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
              <QuestionBadge number={data?.questions.length || 0} />
              {answer ? (
                <Badge color={answer.finished ? "green" : "red"}>
                  {answer.finished ? "Dokončeno" : "Nedokončeno"}
                </Badge>
              ) : null}
            </Flex>
            <Text>{data?.description}</Text>
            {!answer ? (
              owned ? (
                <Heading align="center" size="7" mt="5">
                  Vámi vlastněný kvíz
                </Heading>
              ) : (
                <Flex justify="center" mt="2">
                  <Button
                    size="4"
                    onClick={() => playHandle()}
                    disabled={fetching}
                  >
                    {fetching ? <Spinner /> : "Spustit kvíz"}
                  </Button>
                </Flex>
              )
            ) : answer?.finished ? (
              <>
                <Heading align="center" size="7" mt="5">
                  Vaše odpovědi
                </Heading>
                <Flex direction="column" gap="3" mx="3">
                  {answer?.allUserAnswers.map((e, index) => {
                    return (
                      <Callout.Root
                        color={
                          answer?.correctAnswers.includes(e) ? "green" : "red"
                        }
                      >
                        <Callout.Icon>
                          {answer.correctAnswers.includes(e) ? (
                            <CheckIcon />
                          ) : (
                            <Cross1Icon />
                          )}
                        </Callout.Icon>
                        <Callout.Text>
                          <Box>
                            <Heading>
                              Otázka: {data?.questions[index].question}
                            </Heading>
                            <Text>
                              <Flex gap="1" align="center">
                                <Text>Vaše odpověď:</Text>
                                {sortedQuestions[index].type == "Multiselect"
                                  ? JSON.parse(
                                      answer?.allUserAnswers[index],
                                    ).map((e: string) => <Badge>{e}</Badge>)
                                  : answer.allUserAnswers[index]}
                              </Flex>
                            </Text>
                          </Box>
                        </Callout.Text>
                      </Callout.Root>
                    );
                  })}
                </Flex>
              </>
            ) : (
              <Heading align="center" size="7" mt="5">
                Kvíz nebyl dokončen!
              </Heading>
            )}
          </Container>
        </>
      )}
    </Section>
  );
}
