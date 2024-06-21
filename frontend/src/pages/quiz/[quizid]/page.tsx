import {
  Container,
  Heading,
  Section,
  Text,
  Flex,
  Badge,
  HoverCard,
  Box,
  Button,
  AlertDialog,
  Spinner,
  Callout,
  IconButton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import Quiz from "../../../types/Quiz";
import getQuiz, { getOwned } from "../../../api/getQuiz";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../../types/User";
import getAuthor from "../../../api/getAuthor";
import play, { isPlaying } from "../../../api/play";
import isLogedIn from "../../../utils/logedin";
import { validatedQuizAnswer } from "../../../api/validatedQuizAnswer";
import ValidatedQuizAnswer from "../../../types/ValidatedQuizAnswer";
import {
  CheckIcon,
  Cross1Icon,
  Share1Icon,
  StarFilledIcon,
  StarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import QuestionBadge from "../../../components/quiz/questionBadge";
import removeQuiz from "../../../api/removeQuiz";
import QuizStats from "../../../types/QuizStats";
import { getStatistics, getViews } from "../../../api/getStatistics";
import AnswerCorrectPercentageChart from "../../../components/quiz/answerCorrectPercentageChart";
import QuizPlayChart from "../../../components/quiz/quizPlayChart";
import QuizViewChart from "../../../components/quiz/quizViewChart";
import shareAnswerAPI, { removeShareAnswer } from "../../../api/shareAnswer";
import { FinishedBadgeAnswer } from "../../../components/quiz/finishedBadge";
import ViewsBadge from "../../../components/quiz/viewsBadge";
import { getLiked, setLiked as setLikedAPI } from "../../../api/favourites";
import UserBadge from "../../../components/user/UserBadge";

export default function QuizComponent() {
  const [data, setData] = useState<Quiz>();
  const [author, setAuthor] = useState<User | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();
  const dialog = useRef<HTMLButtonElement>(null);
  const [fetching, setFetching] = useState(false);
  const [notfound, setNotFound] = useState(false);
  const [answer, setAnswer] = useState<ValidatedQuizAnswer | undefined>();
  const [owned, setOwned] = useState<boolean>();
  const [liked, setLiked] = useState<boolean>();
  const [stats, setStats] = useState<QuizStats | null>();
  const [views, setViews] = useState<number[]>();
  const shareDialogTrigger = useRef<HTMLButtonElement>(null);
  const shareDialogClose = useRef<HTMLButtonElement>(null);
  const [shareUrl, setShareUrl] = useState<string>();

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
        const liked = await getLiked(id || "");
        setLiked(liked);
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

  async function handleShareRemove() {
    await removeShareAnswer(id || "")
    shareDialogClose.current?.click();
    toast.success("Sdílení kvízu bylo odstaněno!");
  }

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

  async function shareAnswer() {
    const key = await shareAnswerAPI(id || "");

    const currentLocation = new URL(window.location.href);
    currentLocation.pathname = "/answer/share/" + key;
    setShareUrl(currentLocation.href);
    shareDialogTrigger.current?.click();
  }

  async function handleLike() {
    await setLikedAPI(id || "");
    setLiked(!liked);
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
              <Flex my="1" gap="1" wrap="wrap">
                <Badge color="sky">
                  {new Date(
                    data?.createDate || new Date().toString(),
                  ).toLocaleDateString()}
                </Badge>{" "}
                <UserBadge user={author} />
                <QuestionBadge number={data?.questions.length || 0} />
                <Tooltip content={`${data?.likes} lidem se tento kvíz líbí.`}>
                  <Badge color="amber">{data?.likes + " liků"}</Badge>
                </Tooltip>{" "}
                {owned ? (
                  <>
                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <Badge color="cyan">{data?.totalViews} zhlédnutí</Badge>
                      </HoverCard.Trigger>
                      <HoverCard.Content>
                        {views !== undefined ? (
                          <QuizViewChart views={views} />
                        ) : (
                          <Spinner />
                        )}
                      </HoverCard.Content>
                    </HoverCard.Root>
                    {stats !== null ? (
                      <HoverCard.Root>
                        <HoverCard.Trigger>
                          <Badge color="cyan">{data?.totalPlays} zahrání</Badge>
                        </HoverCard.Trigger>
                        <HoverCard.Content>
                          {stats !== undefined ? (
                            <QuizPlayChart quizData={stats} />
                          ) : (
                            <Spinner />
                          )}
                        </HoverCard.Content>
                      </HoverCard.Root>
                    ) : (
                      <Badge color="cyan">{data?.totalPlays} zahrání</Badge>
                    )}
                  </>
                ) : (
                  <ViewsBadge quiz={data} />
                )}
                <FinishedBadgeAnswer answer={answer} />
              </Flex>
              <Flex gap="1">
                <Badge
                  color="yellow"
                  style={{ cursor: "pointer" }}
                  onClick={handleLike}
                >
                  {liked ? <StarFilledIcon /> : <StarIcon />}
                </Badge>
                {owned ? (
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
                ) : null}
              </Flex>
            </Flex>
            <Text>{data?.description}</Text>
            {!answer ? (
              owned ? (
                <>
                  <Heading align="center" mt="8" size="8">
                    Odpovědi
                  </Heading>
                  <Flex justify="center">
                    {stats !== undefined ? (
                      stats !== null ? (
                        <AnswerCorrectPercentageChart quizData={stats} />
                      ) : (
                        <Text align="center" as="p">
                          Tento kvíz si zatím nikdo úspěšně nezahrál.
                        </Text>
                      )
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
                <Flex justify="center" mt="4">
                  <IconButton onClick={shareAnswer}>
                    <Share1Icon />
                  </IconButton>
                </Flex>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button
                      style={{ display: "none" }}
                      ref={shareDialogTrigger}
                    ></Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>
                      Sdílení odpovédi kvízu
                    </AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Odpověď kvízu byla zveřejněna pod tímto odkazem. Kdokoliv
                      s tímto odkazem může se podívat na vaši odpověď kvízu.
                    </AlertDialog.Description>

                    <TextField.Root
                      placeholder="URL"
                      defaultValue={shareUrl}
                      readOnly
                      mt="2"
                    />

                    <Flex gap="3" mt="4" justify="between">
                      <Button color="red" onClick={handleShareRemove}>Odstranit sdílení</Button>
                      <AlertDialog.Action>
                        <Button variant="solid" ref={shareDialogClose} onClick={() => setShareUrl("")}>OK</Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
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
