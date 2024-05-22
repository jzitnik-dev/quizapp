import {
  Card,
  Heading,
  Badge,
  Flex,
  AlertDialog,
  IconButton,
  Button,
  Strong,
} from "@radix-ui/themes";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import QuestionDialog from "./questionDialog";
import Question from "../../types/Question";
import QuestionType from "../../types/QuestionType";

export default function QuestionCard({
  question,
  index,
  removeCallback,
  editCallback,
}: {
  question: Question;
  index: number;
  removeCallback: (index: number) => any;
  editCallback: (index: number, edit: Question) => any;
}) {
  function removeQuestionApprove() {
    removeCallback(index);
  }

  function edit(q: Question) {
    editCallback(index, q);
  }

  return (
    <Card>
      <Heading size="5">{question.question}</Heading>
      <Badge>
        {question.type == QuestionType.Default
          ? "Výchozí"
          : question.type == QuestionType.TrueFalse
            ? "Pravda / Nepravda"
            : question.type == QuestionType.Singleselect
              ? "Jedno násobný výběr"
              : "Více násobný výběr"}
      </Badge>
      <Flex mt="2" gap="1" justify="end">
        <QuestionDialog
          questionMessage="Upravit otázku"
          callback={edit}
          defaultValue={question}
        >
          <IconButton>
            <Pencil2Icon />
          </IconButton>
        </QuestionDialog>
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <IconButton color="red">
              <TrashIcon />
            </IconButton>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Odstranit otázku</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Jste si jistí že chcete odstranit vybranou otázku?{" "}
              <Strong>Tato akce je nevratná.</Strong>
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Zrušit
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  variant="solid"
                  color="red"
                  onClick={removeQuestionApprove}
                >
                  Odstranit
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
    </Card>
  );
}
