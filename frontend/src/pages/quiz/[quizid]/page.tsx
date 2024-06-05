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
import { CheckIcon, Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import QuestionBadge from "../../../components/quiz/questionBadge";
import removeQuiz from "../../../api/removeQuiz";
import QuizStats from "../../../types/QuizStats";
import { getStatistics, getViews } from "../../../api/getStatistics";
import AnswerCorrectPercentageChart from "../../../components/quiz/answerCorrectPercentageChart";
import QuizPlayChart from "../../../components/quiz/quizPlayChart";
import QuizViewChart from "../../../components/quiz/quizViewChart";

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
  const [stats, setStats] = useState<QuizStats | null>();
  const [views, setViews] = useState<number[]>();

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
        if (owned) {
          const stats = await getStatistics(id || "");
          if (stats == null) {
            setStats(null);
          } else {
            setStats(stats);
          }
          const views = await getViews(id || "");
          setViews(views);
        }
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

  async function handleRemoveQuiz() {
    await removeQuiz(parseInt(id || "0"));
    navigate("/");
    toast.success("Kvíz byl odstraněn!");
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

            <Flex justify="between">
              <Flex my="1" gap="1">
                <Badge color="sky">
                  {new Date(
                    data?.createDate || new Date().toString(),
                  ).toLocaleDateString()}
                </Badge>{" "}
                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <Badge style={{ cursor: "pointer" }}>
                      <Link to={owned ? "/me" : "/user/" + author?.username}>
                        {author?.displayName}
                      </Link>
                    </Badge>
                  </HoverCard.Trigger>
                  <HoverCard.Content maxWidth="300px">
                    <Link to={owned ? "/me" : "/user/" + author?.username}>
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
              {owned ? (
                <Flex gap="1">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                      <Badge color="red" style={{ cursor: "pointer" }}>
                        <TrashIcon />
                      </Badge>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                      <AlertDialog.Title>Odstranit kvíz</AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Opravdu chcete odstranit tento kvíz?
                      </AlertDialog.Description>

                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                          <Button variant="soft" color="gray">
                            Ne
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button
                            variant="solid"
                            color="red"
                            onClick={handleRemoveQuiz}
                          >
                            Ano
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </Flex>
              ) : null}
            </Flex>
            <Text>{data?.description}</Text>
            {!answer ? (
              owned ? (
                <>
                  <Heading align="center" size="8" mt="5">
                    Statistiky kvízu
                  </Heading>
                  <Text align="center" as="p">
                    Statistiky Vašeho kvízu.
                  </Text>
                  <Heading align="center" mt="4">
                    Odpovědi
                  </Heading>
                  <Flex justify="center">
                    {stats !== undefined ? (
                      stats !== null ? (
                        <AnswerCorrectPercentageChart quizData={stats} />
                      ) : (
                        <Text align="center" as="p">
                          Tento kvíz si zatím nikdo nezahrál.
                        </Text>
                      )
                    ) : (
                      <Spinner />
                    )}
                  </Flex>
                  <Heading align="center" mt="4">
                    Počet zahrání
                  </Heading>
                  <Flex justify="center">
                    {stats !== undefined ? (
                      stats !== null ? (
                        <QuizPlayChart quizData={stats} />
                      ) : (
                        <Text align="center" as="p">
                          Tento kvíz si zatím nikdo nezahrál.
                        </Text>
                      )
                    ) : (
                      <Spinner />
                    )}
                  </Flex>
                  <Heading align="center" mt="4">
                    Počet zhlédnutí
                  </Heading>
                  <Flex justify="center">
                    {views !== undefined ? (
                      <QuizViewChart views={views} />
                    ) : (
                      <Spinner />
                    )}
                  </Flex>
                </>
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
                  {answer?.answers.map((answer, index) => {
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
                              {sortedQuestions[index].type == "Multiselect"
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
