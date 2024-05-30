import {
  Section,
  Heading,
  Container,
  Text,
  Button,
  Flex,
  Spinner,
  IconButton,
  DropdownMenu,
  Dialog,
  Slider,
} from "@radix-ui/themes";
import Quiz from "../../types/Quiz";
import QuizEl from "../../components/quiz/quiz";
import { useEffect, useRef, useState } from "react";
import Page from "../../types/Page";
import getDiscover from "../../api/getDiscover";
import { Link, useParams } from "react-router-dom";
import { ListBulletIcon } from "@radix-ui/react-icons";

export default function Discover() {
  const [quizzes, setQuizzes] = useState<Page<Quiz>>();
  const [questionAmount, setQuestionAmount] = useState<number>();
  const questionAmountDialog = useRef<HTMLButtonElement>(null);
  const { pagenumber } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getDiscover(pagenumber);
      setQuizzes(res);
    })();
  }, []);

  function setSort(_: string) {
    // If there will be more sorting options, implement here.
  }

  function setFilterQuestionAmount() {
    questionAmountDialog.current?.click();
  }

  function submitFilterQuestionAmount() {
    (async () => {
      const res = await getDiscover(pagenumber, questionAmount);
      setQuizzes(res);
    })();
  }

  return (
    <Section position="relative">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button style={{ display: "none" }} ref={questionAmountDialog}>
            Edit profile
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Počet otázek</Dialog.Title>

          <Flex align="center" gap="2">
            <Slider
              defaultValue={[questionAmount || 10]}
              max={20}
              min={1}
              onValueChange={(value) => setQuestionAmount(value[0])}
            />
            <Text style={{ width: "20px" }} align="right">
              {questionAmount || 10}
            </Text>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Zrušit
              </Button>
            </Dialog.Close>
            <Dialog.Close onClick={submitFilterQuestionAmount}>
              <Button>Uložit</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <Container>
        {quizzes === undefined ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : (
          <>
            <Flex mb="5" align="center" justify="between">
              <Heading size="9">Procházet</Heading>
              <Flex gap="1">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton>
                      <ListBulletIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Sub>
                      <DropdownMenu.SubTrigger>
                        Filtrovat
                      </DropdownMenu.SubTrigger>
                      <DropdownMenu.SubContent>
                        <DropdownMenu.Item
                          onClick={() => setFilterQuestionAmount()}
                        >
                          Počet otázek
                        </DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Sub>
                      <DropdownMenu.SubTrigger>Řazení</DropdownMenu.SubTrigger>
                      <DropdownMenu.SubContent>
                        <DropdownMenu.Item onClick={() => setSort("newest")}>
                          Nejnovější
                        </DropdownMenu.Item>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
            </Flex>
            {quizzes?.empty ? (
              <Text align="center" as="p" mt="3">
                Žádný kvíz nebyl nalezen
              </Text>
            ) : (
              <>
                <Flex direction="column" mt="3" gap="2">
                  {quizzes?.content.map((el) => <QuizEl quiz={el} />)}
                </Flex>
                <Flex align="center" justify="center" mt="5" gap="3">
                  {quizzes.first ? (
                    <Button disabled={true}>Předchozí</Button>
                  ) : (
                    <Link to={`/discover/page/${quizzes.number}`}>
                      <Button>Předchozí</Button>
                    </Link>
                  )}

                  <Text>{`Stránka ${(quizzes?.number || 0) + 1} z ${quizzes?.totalPages}`}</Text>
                  {quizzes.first ? (
                    <Button disabled={true}>Další</Button>
                  ) : (
                    <Link to={`/discover/page/${quizzes.number + 2}`}>
                      <Button>Další</Button>
                    </Link>
                  )}
                </Flex>
              </>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
