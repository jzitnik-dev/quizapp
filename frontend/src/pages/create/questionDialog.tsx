import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  Flex,
  Text,
  TextField,
  Select,
  Button,
  SegmentedControl,
  RadioCards,
  IconButton,
  CheckboxCards,
} from "@radix-ui/themes";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Question from "../../types/Question";
import QuestionType from "../../types/QuestionType";

export default function QuestionDialog({
  questionMessage,
  children,
  callback,
  defaultValue,
}: {
  questionMessage: string;
  children: JSX.Element;
  callback: (response: Question) => any;
  defaultValue?: Question;
}) {
  // Form data
  const [type, setType] = useState(
    // Again, I have my life
    defaultValue
      ? defaultValue.type == QuestionType.TrueFalse
        ? "truefalse"
        : defaultValue.type == QuestionType.Singleselect
          ? "singleselect"
          : defaultValue.type == QuestionType.Multiselect
            ? "multiselect"
            : "default"
      : "default",
  );

  const [multiQuestions, setMultiQuestions] = useState<string[]>(
    defaultValue ? JSON.parse(defaultValue.options || "[]") : [],
  );
  const [answer, setAnswer] = useState(defaultValue ? defaultValue.answer : "");
  const [answerx, setAnswerx] = useState("");
  const [question, setQuestion] = useState(
    defaultValue ? defaultValue.question : "",
  );

  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const [error, setError] = useState<string | undefined>("");

  function cleanup() {
    // I hate my life. Why tf the Dialog element doesn't have something like onclose or something for fuck's sake.
    // Now i need to put onclick on the close button. BUT WHEN USER CLICKS OUT OF THE DIALOG THE BUTTON IS NOT PRESSED.
    setError(undefined);
    setQuestion("");
    setAnswerx("");
    setAnswer("");
    setMultiQuestions([]);
    setType("default");
  }

  function save() {
    setError(undefined);
    if (question.length == 0) {
      return setError("Musíte vložit otázku.");
    }

    if (type == "default" && answer.length == 0) {
      return setError("Musíte vložit odpověď.");
    }

    if (
      (type == "multiselect" || type == "singleselect") &&
      multiQuestions.length < 2
    ) {
      return setError("Musíte mít alespoň dvě odpovědi.");
    }

    if (type == "multiselect" && JSON.parse(answer).length < 2) {
      return setError("Musíte mít alespoň dvě správné odpověďi.");
    }

    if (type == "singleselect" && answer.length == 0) {
      return setError("Musíte mít jednu správnou odpověď.");
    }

    const finalType =
      type == "default"
        ? QuestionType.Default
        : type == "singleselect"
          ? QuestionType.Singleselect
          : type == "multiselect"
            ? QuestionType.Multiselect
            : QuestionType.TrueFalse;

    callback({
      question: question,
      type: finalType,
      options: JSON.stringify(multiQuestions),
      answer: answer,
    });
    closeBtn.current?.click();
  }

  function toggleAnswer(e: string) {
    const data = JSON.parse(answer);
    if (data.includes(e)) {
      const copy = data.filter((x: string) => x !== e);
      setAnswer(JSON.stringify(copy));
      return;
    }

    data.push(e);
    setAnswer(JSON.stringify(data));
  }

  function addAnswer() {
    if (!answerx) {
      return toast.error("Musíte vložit odpověď!");
    }
    if (multiQuestions.includes(answerx)) {
      setAnswerx("");
      return toast.error("Tato odpověď již existuje");
    }
    const copy = multiQuestions;
    copy.push(answerx);
    setMultiQuestions(copy);
    setAnswerx("");
  }

  return (
    <Dialog.Root
      onOpenChange={(e) => {
        if (!e) cleanup();
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{questionMessage}</Dialog.Title>
        {error ? <Text color="red">{error}</Text> : null}
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Otázka
            </Text>
            <TextField.Root
              placeholder="Vložte otázku"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Typ otázky
            </Text>
            <Select.Root
              onValueChange={(e) => {
                setType(e);
                if (e == "default" || e == "singleselect") {
                  setAnswer("");
                } else if (e == "multiselect") {
                  setAnswer("[]");
                } else if (e == "truefalse") {
                  setAnswer("true");
                }
              }}
              value={type}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Item value="default">Výchozí</Select.Item>
                  <Select.Item value="multiselect">
                    Otázka s několika odpověďmi
                  </Select.Item>
                  <Select.Item value="singleselect">
                    Otázka s jednou odpovědí
                  </Select.Item>
                  <Select.Item value="truefalse">Pravda / Nepravda</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </label>
          {type == "default" ? (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Odpověď
              </Text>
              <TextField.Root
                placeholder="Vložte odpověď"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></TextField.Root>
              <small>
                Odpověď nebere v potaz malá a velká písmena ani diakritiku.
              </small>
            </label>
          ) : type == "truefalse" ? (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Správná odpověď
              </Text>
              <SegmentedControl.Root
                value={answer}
                onValueChange={(e) => setAnswer(e)}
              >
                <SegmentedControl.Item value="true">
                  Pravda
                </SegmentedControl.Item>
                <SegmentedControl.Item value="false">
                  Nepravda
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </label>
          ) : type == "singleselect" ? (
            <>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Odpovědi
                </Text>
                <Dialog.Root onOpenChange={e => {if (!e) setAnswerx("")}}>
                  <Dialog.Trigger>
                    <Button>
                      <PlusIcon />
                      Přidat odpověď
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Vytvořit odpověď</Dialog.Title>
                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Odpověď
                        </Text>
                        <TextField.Root
                          placeholder="Vložte odpověď"
                          value={answerx}
                          onChange={(e) => setAnswerx(e.target.value)}
                        />
                      </label>
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Zrušit
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close onClick={addAnswer}>
                        <Button>Uložit</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </label>
              {multiQuestions.map((e, index) => {
                return (
                  <Flex align="center" justify="between" py="2" key={index}>
                    <Text>{e}</Text>
                    <IconButton
                      color="red"
                      onClick={() => {
                        const copy = multiQuestions.filter((x) => x !== e);
                        setMultiQuestions(copy);
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                );
              })}
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Správná odpověď
                </Text>
              </label>
              <RadioCards.Root columns={{}} gap="1" value={answer}>
                {multiQuestions.map((e, index) => (
                  <RadioCards.Item
                    value={e}
                    style={{ width: "100%" }}
                    onClick={() => setAnswer(e)}
                    key={index}
                  >
                    <Flex direction="column" width="100%">
                      <Text weight="bold">{e}</Text>
                    </Flex>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </>
          ) : (
            <>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Odpovědi
                </Text>
                <Dialog.Root onOpenChange={e => {if (!e) setAnswerx("")}}>
                  <Dialog.Trigger>
                    <Button>
                      <PlusIcon />
                      Přidat odpověď
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Vytvořit odpověď</Dialog.Title>
                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Odpověď
                        </Text>
                        <TextField.Root
                          placeholder="Vložte odpověď"
                          value={answerx}
                          onChange={(e) => setAnswerx(e.target.value)}
                        />
                      </label>
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Zrušit
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close onClick={addAnswer}>
                        <Button>Uložit</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </label>
              {multiQuestions.map((e, index) => {
                return (
                  <Flex align="center" justify="between" py="2" key={index}>
                    <Text>{e}</Text>
                    <IconButton
                      color="red"
                      onClick={() => {
                        const copy = multiQuestions.filter((x) => x !== e);
                        setMultiQuestions(copy);
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                );
              })}
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Správná odpověď
                </Text>
              </label>
              <CheckboxCards.Root columns={{}} gap="1">
                {multiQuestions.map((e, index) => (
                  <CheckboxCards.Item
                    value={e}
                    style={{ width: "100%" }}
                    onClick={() => toggleAnswer(e)}
                    key={index}
                  >
                    <Flex direction="column" width="100%">
                      <Text weight="bold">{e}</Text>
                    </Flex>
                  </CheckboxCards.Item>
                ))}
              </CheckboxCards.Root>
            </>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              ref={closeBtn}
              variant="soft"
              color="gray"
              onClick={cleanup}
            >
              Zrušit
            </Button>
          </Dialog.Close>
          <Button onClick={save}>Uložit</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
