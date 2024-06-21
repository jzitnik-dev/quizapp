import AnswerType from "../../types/Answer";
import { Callout, Box, Heading, Text, Flex, Badge } from "@radix-ui/themes";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

export default function Answer({ answer }: { answer: AnswerType }) {
  return (
    <Callout.Root color={answer.correct ? "green" : "red"}>
      <Callout.Icon>
        {answer.correct ? <CheckIcon /> : <Cross1Icon />}
      </Callout.Icon>
      <Box>
        <Heading>Otázka: {answer.question.question}</Heading>
        <Text>
          <Flex gap="1" align="center">
            <Text>Odpověď hráče:</Text>
            {answer.question.type.toString() == "Multiselect"
              ? JSON.parse(answer.answer).map((e: string, index: number) => (
                  <Badge key={index}>{e}</Badge>
                ))
              : answer.answer}
          </Flex>
        </Text>
      </Box>
    </Callout.Root>
  );
}
