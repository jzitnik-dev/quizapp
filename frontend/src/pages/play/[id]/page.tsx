import {
  Callout,
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
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Quiz from "../../../types/Quiz";
import getQuiz from "../../../api/getQuiz";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import isLogedIn from "../../../utils/logedin";
import {
  answerQuestion,
  getQuestion,
  isValid,
  skipQuestion,
} from "../../../api/play";
import Question from "../../../types/Question";
import QuestionType from "../../../types/QuestionType";
import { toast } from "react-toastify";

export default function Play() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const [data, setData] = useState<Quiz>();
  const [showDialog, setShowDialog] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [question, setQuestion] = useState<Question>();
  const [finish, setFinish] = useState(false);
  const [answerValue, setAnswerValue] = useState("");

  useEffect(() => {
    if (!key && isLogedIn()) {
      navigate("/quiz/" + id);
    }
    if (!isLogedIn()) {
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
      }, 5000);
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

  async function loadQuestion(currentQuestion: number) {
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
  }

  async function finishFun() {
    setFetching(false);
    setFinish(true);
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

    setFetching(true);
    const finish = await answerQuestion(key || "", answerValue);
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
        {showDialog ? (
          <Callout.Root>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              <Flex align="center" justify="between" as="span">
                <Text>Nejste přihlášeni! Váš progress nebude uložen.</Text>
              </Flex>
            </Callout.Text>
          </Callout.Root>
        ) : null}
        <Heading size="9" align="center">
          {data?.title}
        </Heading>
        <Separator size="4" my="3" />
        {fetching ? (
          <Flex justify="center" mt="3">
            <Spinner />
          </Flex>
        ) : finish ? (
          <>
            <Heading size="8" align="center">
              Konec!
            </Heading>
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
                          <RadioCards.Item value={index.toString()}>
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
                        <SegmentedControl.Item value="true">
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
