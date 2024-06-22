import {
  Container,
  Heading,
  Section,
  Text,
  Flex,
  Badge,
  HoverCard,
  Button,
  AlertDialog,
  Spinner,
  IconButton,
  TextField,
  Tooltip,
  Popover,
  Box,
  TextArea,
  Avatar,
  Strong,
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
  Share1Icon,
  StarFilledIcon,
  StarIcon,
  TrashIcon,
  ChatBubbleIcon,
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
import AnswersList from "../../../components/quiz/answersList";
import Comment from "../../../components/quiz/comment";
import { deleteComment, submitComment } from "../../../api/comment";
import { useUserProfile } from "../../../components/header/UserProfileProvider";
import getProfilePictureUrl from "../../../api/getProfilePictureUrl";

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
  const [commentValue, setCommentValue] = useState("");
  const shareDialogTrigger = useRef<HTMLButtonElement>(null);
  const shareDialogClose = useRef<HTMLButtonElement>(null);
  const [shareUrl, setShareUrl] = useState<string>();
  const { userProfile } = useUserProfile();
  const [playingQuiz, setPlayingQuiz] = useState<Quiz | undefined>();

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

  async function handleComment() {
    if (commentValue.trim().length < 5 || commentValue.trim().length > 500) {
      toast.error(
        "Komentář musí být delší než 5 znaků a musí být kratší než 500 znaků.",
      );
      return;
    }

    await submitComment(id || "", commentValue);
    toast.success("Komentář vytvořen!");
    const res = await getQuiz((id || 0) as number);
    setData(res);
  }

  async function handleCommentRemove() {
    await deleteComment(id || "");
    toast.success("Komentář odstraněn!");
    const res = await getQuiz((id || 0) as number);
    setData(res);
  }

  async function handleShareRemove() {
    await removeShareAnswer(id || "");
    shareDialogClose.current?.click();
    toast.success("Sdílení kvízu bylo odstaněno!");
  }

  async function playHandle() {
    setFetching(true);
    const playing = await isPlaying();
    if (playing) {
      if (playing.id == parseInt(id || "")) {
        toast.error("Tento kvíz již hrajete!");
        setFetching(false);
        return;
      }
      setPlayingQuiz(playing);
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
                Na Vašem účtu hra již probíhá! Právě hrajete kvíz{" "}
                <Strong>{playingQuiz?.title}</Strong>. Pokud začněte novou hru,
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
                  <AnswersList answers={answer.answers} />
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
                      Odpověď kvízu byla zveřejněna pod tímto odkazem a na Vašem
                      profilu. Kdokoliv se může podívat na vaši odpověď tohoto
                      kvízu.
                    </AlertDialog.Description>

                    <TextField.Root
                      placeholder="URL"
                      defaultValue={shareUrl}
                      readOnly
                      mt="2"
                    />

                    <Flex gap="3" mt="4" justify="between">
                      <Button color="red" onClick={handleShareRemove}>
                        Odstranit sdílení
                      </Button>
                      <AlertDialog.Action>
                        <Button
                          variant="solid"
                          ref={shareDialogClose}
                          onClick={() => setShareUrl("")}
                        >
                          OK
                        </Button>
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
            <Section>
              <Flex align="center" justify="center" gap="2" mb="4">
                <Heading size="8" align="center">
                  Komentáře
                </Heading>
                {!data?.comments.some(
                  (e) => e.author.username == userProfile?.username,
                ) && author?.username !== userProfile?.username ? (
                  <Popover.Root>
                    <Popover.Trigger>
                      <Button variant="soft">
                        <ChatBubbleIcon width="16" height="16" />
                        Napsat komentář
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content width="360px">
                      <Flex gap="3">
                        <Avatar
                          size="2"
                          fallback={userProfile?.displayName[0] || "U"}
                          radius="full"
                          src={getProfilePictureUrl(
                            userProfile?.username || "",
                          )}
                        />
                        <Box flexGrow="1">
                          <TextArea
                            placeholder="Napište komentář…"
                            style={{ height: 80 }}
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                          />
                          <Flex mt="3" justify="end">
                            <Popover.Close>
                              <Button onClick={handleComment} size="1">
                                Odeslat
                              </Button>
                            </Popover.Close>
                          </Flex>
                        </Box>
                      </Flex>
                    </Popover.Content>
                  </Popover.Root>
                ) : null}
              </Flex>
              {data?.comments.length == 0 ? (
                <Text align="center" as="p">
                  Žádné komentáře nebyly zatím vytvořeny.
                </Text>
              ) : (
                <Flex direction="column" gap="2" mt="5" align="center">
                  {data?.comments.map((e, index) => (
                    <Comment
                      key={index}
                      comment={e}
                      handleRemove={handleCommentRemove}
                    />
                  ))}
                </Flex>
              )}
            </Section>
          </Container>
        </>
      )}
    </Section>
  );
}
