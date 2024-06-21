import {
  Container,
  Heading,
  Section,
  Flex,
  Text,
  Spinner,
  Separator,
  TextField,
  Box,
  Button,
  AlertDialog,
  RadioCards,
  CheckboxCards,
  SegmentedControl,
  Progress,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import getQuiz from "../../../api/getQuiz";
import isLogedIn from "../../../utils/logedin";
import {
  answerQuestion,
  cancel,
  finishQuiz,
  getQuestion,
  isValid,
  skipQuestion,
} from "../../../api/play";
import Question from "../../../types/Question";
import QuestionType from "../../../types/QuestionType";
import { toast } from "react-toastify";
import ValidatedQuizAnswer from "../../../types/ValidatedQuizAnswer";
import Quiz from "../../../types/Quiz";
import AnswersList from "../../../components/quiz/answersList";

export default function Play() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const [data, setData] = useState<Quiz>();
  const [fetching, setFetching] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [question, setQuestion] = useState<Question>();
  const [finish, setFinish] = useState(false);
  const [answerValue, setAnswerValue] = useState("");
  const [finishData, setFinishData] = useState<ValidatedQuizAnswer>();
  const [unfinished, setUnfinished] = useState(false);

  const defaultInputBox = useRef<HTMLInputElement>(null);
  const trueButton = useRef<HTMLButtonElement>(null);
  const singleSelectButton = useRef<HTMLButtonElement>(null);
  const multiselectButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "visible") {
        setUnfinished(true);
        await cancel(key || "");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!key && isLogedIn()) {
      navigate("/quiz/" + id);
    }
    if (!isLogedIn()) {
      navigate("/login");
    } else {
      (async () => {
        const valid = await isValid(key || "", id || "");
        if (!valid) {
          return navigate("/quiz/" + id);
        }
      })();
    }

    (async () => {
      const res = await getQuiz((id || 0) as number);
      setData(res);

      await loadQuestion(currentQuestion);
    })();
  }, []);

  useEffect(() => {
    if (question?.type == QuestionType.Default) {
      defaultInputBox.current?.focus();
    } else if (question?.type == QuestionType.TrueFalse) {
      trueButton.current?.focus();
    } else if (question?.type == QuestionType.Singleselect) {
      singleSelectButton.current?.focus();
      singleSelectButton.current?.click();
    } else if (question?.type == QuestionType.Multiselect) {
      multiselectButton.current?.focus();
    }
  }, [fetching]);

  async function loadQuestion(currentQuestion: number) {
    try {
      const question = await getQuestion(key || "", currentQuestion);
      setQuestion(question);
      setFetching(false);

      if (question.type == QuestionType.Default) {
        setAnswerValue("");
      } else if (question.type == QuestionType.TrueFalse) {
        setAnswerValue("true");
      } else if (question.type == QuestionType.Singleselect) {
        setAnswerValue("");
      } else if (question.type == QuestionType.Multiselect) {
        setAnswerValue("[]");
      }
    } catch (e: any) {
      if (e.message == "invalidquestion") {
        setUnfinished(true);
        setFetching(false);
      } else {
        throw e;
      }
    }
  }

  async function finishFun() {
    setFetching(false);
    setFinish(true);
    const res = await finishQuiz(key || "");
    setFinishData(res);
  }

  async function skip() {
    setFetching(true);
    const finish = await skipQuestion(key || "");
    if (finish) {
      finishFun();
      return;
    }
    const next = currentQuestion + 1;
    setCurrentQuestion(next);
    await loadQuestion(next);
  }

  async function answer() {
    if (
      (question?.type == QuestionType.Default && answerValue.length == 0) ||
      (question?.type == QuestionType.Singleselect &&
        answerValue.length == 0) ||
      (question?.type == QuestionType.Multiselect &&
        JSON.parse(answerValue).length == 0)
    ) {
      return toast.error("Odpověď nemůže být prázdná!");
    }

    let finalAnswer: string;
    if (question?.type == QuestionType.Singleselect) {
      finalAnswer = JSON.parse(question.options || "[]")[answerValue];
    } else if (question?.type == QuestionType.Multiselect) {
      const op = JSON.parse(question.options || "[]");
      finalAnswer = JSON.stringify(
        JSON.parse(answerValue).map((e: string) => op[e]),
      );
    } else {
      finalAnswer = answerValue;
    }

    setFetching(true);
    const finish = await answerQuestion(key || "", finalAnswer);
    if (finish) {
      finishFun();
      return;
    }
    const next = currentQuestion + 1;
    setCurrentQuestion(next);
    await loadQuestion(next);
  }

  return (
    <Section>
      <Container>
        {!unfinished ? (
          <Flex justify="center">
            <Progress
              max={data?.questions.length}
              value={finish ? data?.questions.length : currentQuestion - 1}
            />
          </Flex>
        ) : null}

        <Heading size="9" align="center" mt="5">
          {data?.title}
        </Heading>
        <Separator size="4" my="3" />
        {fetching ? (
          <Flex justify="center" mt="3">
            <Spinner />
          </Flex>
        ) : unfinished ? (
          <>
            <Heading align="center">Nedokončeno!</Heading>
            <Text align="center" as="p">
              Pravděpodobně jste načetl stránku znovu nebo přepl kartu v
              prohlížeči.
            </Text>
            <Text align="center" as="p">
              Tento kvíz si již nebudete moct zahrát.
            </Text>
            <Flex justify="center" mt="2">
              <Link to={`/quiz/${data?.id}`}>
                <Button>Zpět</Button>
              </Link>
            </Flex>
          </>
        ) : finish ? (
          <>
            <Heading size="8" align="center">
              Konec!
            </Heading>
            <Heading size="9" align="center">
              {finishData?.answers.filter((item) => item.correct).length}/
              {finishData?.answers.length}
            </Heading>
            <Heading size="7" align="center" mt="3">
              Vaše odpovědi
            </Heading>
            <Flex direction="column" gap="3" mx="3">
              <AnswersList answers={finishData?.answers || []} />
              <Link to={"/quiz/" + data?.id}>
                <Button>Zpět</Button>
              </Link>
            </Flex>
          </>
        ) : (
          <>
            <Heading size="8">{currentQuestion}.</Heading>
            <Heading size="8">{question?.question}</Heading>
            <Flex justify="center" mt="5">
              <Box maxWidth="500px" width="100%">
                {question?.type == QuestionType.Default ? (
                  <>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Odpověď
                      </Text>
                      <TextField.Root
                        value={answerValue}
                        onChange={(e) => setAnswerValue(e.target.value)}
                        placeholder="Vložte vaši odpověď"
                        ref={defaultInputBox}
                        onKeyUp={(e) => {
                          if (e.key == "Enter") {
                            answer();
                          }
                        }}
                      ></TextField.Root>
                      <small>
                        Odpověď nebere v potaz malá a velká písmena ani
                        diakritiku.
                      </small>
                    </label>
                  </>
                ) : question?.type == QuestionType.Singleselect ? (
                  <>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Odpověď
                    </Text>
                    <RadioCards.Root
                      columns={{ initial: "1", sm: "3" }}
                      onValueChange={(e) => setAnswerValue(e)}
                    >
                      {JSON.parse(question?.options || "[]").map(
                        (option: string, index: number) => (
                          <RadioCards.Item
                            value={index.toString()}
                            key={index}
                            ref={index == 0 ? singleSelectButton : null}
                          >
                            <Flex direction="column" width="100%">
                              <Text>{option}</Text>
                            </Flex>
                          </RadioCards.Item>
                        ),
                      )}
                    </RadioCards.Root>
                  </>
                ) : question?.type == QuestionType.Multiselect ? (
                  <>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Odpověď
                    </Text>
                    <CheckboxCards.Root
                      columns={{ initial: "1", sm: "3" }}
                      onValueChange={(e) => setAnswerValue(JSON.stringify(e))}
                    >
                      {JSON.parse(question?.options || "[]").map(
                        (option: string, index: number) => (
                          <CheckboxCards.Item
                            value={index.toString()}
                            style={{ cursor: "pointer" }}
                            key={index}
                            ref={index == 0 ? multiselectButton : null}
                          >
                            <Flex direction="column" width="100%">
                              <Text>{option}</Text>
                            </Flex>
                          </CheckboxCards.Item>
                        ),
                      )}
                    </CheckboxCards.Root>
                  </>
                ) : question?.type == QuestionType.TrueFalse ? (
                  <>
                    <Text as="div" size="2" mb="1" weight="bold" align="center">
                      Odpověď
                    </Text>
                    <Flex justify="center" mb="5">
                      <SegmentedControl.Root
                        size="3"
                        value={answerValue}
                        onValueChange={(e) => setAnswerValue(e)}
                      >
                        <SegmentedControl.Item value="true" ref={trueButton}>
                          Pravda
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="false">
                          Nepravda
                        </SegmentedControl.Item>
                      </SegmentedControl.Root>
                    </Flex>
                  </>
                ) : null}
                <Flex justify="between" mt="3">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                      <Button color="red">Přeskočit</Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                      <AlertDialog.Title>
                        Opravdu chcete otázku přeskočit?
                      </AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Pokud otázku přeskočíte, nebudete se moc k ní později
                        vrátit a bude zaznačena jako chyba.
                      </AlertDialog.Description>

                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                          <Button variant="soft" color="gray">
                            Zrušit
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button variant="solid" color="red" onClick={skip}>
                            Přeskočit
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>

                  <Button onClick={answer}>Odeslat</Button>
                </Flex>
              </Box>
            </Flex>
          </>
        )}
      </Container>
    </Section>
  );
}
