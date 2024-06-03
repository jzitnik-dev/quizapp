import {
  Container,
  Heading,
  Section,
  TextField,
  Flex,
  Separator,
  Text,
  Strong,
  TextArea,
  Button,
  Spinner,
  Callout,
  Box,
} from "@radix-ui/themes";
import QuestionDialog from "./questionDialog";
import isLogedIn from "../../utils/logedin";
import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import QuestionCard from "./questionCard";
import Question from "../../types/Question";
import Quiz from "../../types/Quiz";
import submitQuiz from "../../api/submitQuiz";

export default function Create() {
  const navigate = useNavigate();
  const [next, setNext] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState(false);
  const [sent, setSent] = useState(false);
  const [quizId, setQuizId] = useState<number | undefined>();

  // Form data
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // If user not loged in redirect to login
  useEffect(() => {
    if (!isLogedIn()) {
      navigate("/login");
    }
  }, []);

  function submitForm(e: FormEvent) {
    e.preventDefault();

    if (name.length > 50) {
      return toast.error("Jméno kvízu je delší jak 50 znaků.");
    }
    if (desc.length > 500) {
      return toast.error("Popis kvízu je delší jak 500 znaků.");
    }

    setNext(true);
  }

  function createQuestion(question: Question) {
    const copy = [...questions];
    copy.push(question);
    setQuestions(copy);
  }

  function removeQuestion(index: number) {
    const copy = [...questions];
    copy.splice(index, 1);
    setQuestions(copy);
  }

  function editQuestion(index: number, edit: Question) {
    const copy = [...questions];
    copy[index] = edit;
    setQuestions(copy);
  }

  async function submit() {
    if (questions.length < 5) {
      return toast.error("Musíte mít alespoň 5 otázek.");
    }

    const finalQuiz = {
      title: name,
      description: desc,
      questions: questions,
    } as Quiz;

    setFetching(true);

    const res = await submitQuiz(finalQuiz);

    setFetching(false);
    setSent(true);
    setQuizId(res.id);
  }

  return (
    <Section>
      <Container maxWidth="800px">
        {!next ? (
          <>
            <Heading size="9">Vytvořit kvíz</Heading>
            <Separator size="4" />
            <form style={{ marginTop: "20px" }} onSubmit={submitForm}>
              <Flex direction="column" gap="3">
                <label style={{ maxWidth: "400px" }}>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Jméno kvízu
                  </Text>
                  <TextField.Root
                    placeholder="Zadejte jméno kvízu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></TextField.Root>
                  <Flex justify="between" mt="1">
                    <small>
                      Maximálně <Strong>50</Strong> znaků.
                    </small>
                    <small style={{ color: name.length > 50 ? "red" : "" }}>
                      <Strong>{name.length}</Strong>/50
                    </small>
                  </Flex>
                </label>
                <label style={{ maxWidth: "400px" }}>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Popis kvízu
                  </Text>
                  <TextArea
                    placeholder="Zadejte popis kvízu"
                    style={{ maxWidth: "400px", resize: "vertical" }}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                  ></TextArea>
                  <Flex justify="between" mt="1">
                    <small>
                      Stručný popis kvízu. Maximálně <Strong>500</Strong> znaků.{" "}
                    </small>
                    <small style={{ color: desc.length > 500 ? "red" : "" }}>
                      <Strong>{desc.length}</Strong>/500
                    </small>
                  </Flex>
                </label>
                <Flex justify="end">
                  <Button>
                    Další <ArrowRightIcon />
                  </Button>
                </Flex>
              </Flex>
            </form>
          </>
        ) : sent ? (
          <Callout.Root color="green">
            <Callout.Icon>
              <CheckIcon />
            </Callout.Icon>
            <Callout.Text>
              Kvíz byl publikován!
              <br />
              <Link to={`/quiz/${quizId}`}>
                <Button mt="1" color="indigo">
                  Přejít na kvíz
                </Button>
              </Link>
            </Callout.Text>
          </Callout.Root>
        ) : (
          <>
            <Flex
              justify="between"
              align="end"
              className="flex-col items-start md:flex-row md:items-end"
            >
              <Box>
                <Heading size="9">Nastavit otázky</Heading>
                <Text color="gray">
                  Otázky nemusí být ve stejném pořadí, v jakém je přidáváte.
                </Text>
              </Box>
              <QuestionDialog
                questionMessage="Vytvořit otázku"
                callback={createQuestion}
              >
                <Button>
                  <PlusIcon />
                  Vytvořit otázku
                </Button>
              </QuestionDialog>
            </Flex>

            <Flex mt="4" mb="4" direction="column" gap="2">
              {questions.map((e, i) => (
                <QuestionCard
                  question={e}
                  index={i}
                  removeCallback={removeQuestion}
                  editCallback={editQuestion}
                  key={i}
                />
              ))}
            </Flex>

            <Flex justify="between">
              <Button onClick={() => setNext(false)}>
                <ArrowLeftIcon /> Zpět
              </Button>
              <Button onClick={submit} disabled={fetching}>
                {fetching ? (
                  <Spinner />
                ) : (
                  <>
                    {" "}
                    <Share2Icon /> Nahrát
                  </>
                )}
              </Button>
            </Flex>
          </>
        )}
      </Container>
    </Section>
  );
}
