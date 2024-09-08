import {
  Section,
  Container,
  Heading,
  Text,
  Separator,
  Flex,
  Card,
  Link,
  Badge,
  Callout,
  Spinner,
} from "@radix-ui/themes";
import { MouseEvent, useEffect, useRef } from "react";
import "../../styles/index.css";
import { Init, MouseMove } from "../../utils/gradient/MultiCardFlexGradient";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "react-query";
import getGlobalMessages from "../../api/getGlobalMessages";
import { LocalizationText } from "../../localization/Localization";

export default function Index() {
  const cardsFlex = useRef<HTMLDivElement>(null);

  const { data, status } = useQuery("globalMessages", getGlobalMessages);

  useEffect(() => Init(cardsFlex.current), [cardsFlex]);

  return (
    <Section>
      <Container>
        {status == "success" ? (
          data &&
          data.length !== 0 && (
            <Flex
              maxWidth="500px"
              className="mx-auto"
              direction="column"
              gap="4"
            >
              {data.map((globalMessage, index) => (
                <Callout.Root
                  key={index}
                  color={
                    globalMessage.type == "INFO"
                      ? undefined
                      : globalMessage.type == "DANGER"
                        ? "red"
                        : globalMessage.type == "WARNING"
                          ? "yellow"
                          : undefined
                  }
                >
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text
                    dangerouslySetInnerHTML={{
                      __html: globalMessage.markdownContent,
                    }}
                  ></Callout.Text>
                </Callout.Root>
              ))}
            </Flex>
          )
        ) : (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        )}

        <Section>
          <Flex align="center" direction="column">
            <Flex align="center" gap="2">
              <img src="/logo.png" className="h-10" />
              <Heading size="9" align="center">
                QuizAPP
              </Heading>
            </Flex>

            <Separator size="3" />
            <Text align="center" as="p" size="5">
              <LocalizationText>create_and_share</LocalizationText>
            </Text>
          </Flex>
        </Section>
        <Section>
          <Heading size="8" align="center">
            <LocalizationText>why_quizapp</LocalizationText>
          </Heading>
          <Flex
            gap="3"
            mt="4"
            className="flex-col md:flex-row"
            onMouseMove={(e: MouseEvent) => MouseMove(e, cardsFlex.current)}
            ref={cardsFlex}
          >
            <Card className="basis-full indexgradient">
              <Heading>
                <LocalizationText>easy_creation</LocalizationText>
              </Heading>
              <Text mt="1" as="p">
                <LocalizationText>easy_creation_sub</LocalizationText>
              </Text>
            </Card>
            <Card className="basis-full indexgradient">
              <Heading>
                <LocalizationText>answer_saving</LocalizationText>
              </Heading>
              <Text mt="1" as="p">
                <LocalizationText>answer_saving_sub</LocalizationText>
              </Text>
            </Card>
            <Card className="basis-full indexgradient">
              <Heading>
                <LocalizationText>easy_validation</LocalizationText>
              </Heading>
              <Text mt="1" as="p">
                <LocalizationText>easy_validation_sub</LocalizationText>
              </Text>
            </Card>
          </Flex>
        </Section>
        <Section>
          <Heading size="8" align="center">
            <LocalizationText>faq</LocalizationText>
          </Heading>
          <Heading size="7" mt="5">
            <LocalizationText>how_to_create_quiz</LocalizationText>
          </Heading>
          <Heading mt="2">
            <LocalizationText>step_1_create_quiz</LocalizationText>
          </Heading>
          <Text>
            <LocalizationText>step_1_create_quiz_sub</LocalizationText>
          </Text>{" "}
          <Link href="/signup" target="_blank">
            <LocalizationText>open_register</LocalizationText>
          </Link>
          <Heading mt="2">
            <LocalizationText>step_2_create_quiz</LocalizationText>
          </Heading>
          <Text>
            <LocalizationText>step_2_create_quiz_sub</LocalizationText>
            <Flex gap="1" wrap="wrap">
              <Badge color="gray">
                <LocalizationText>question_type_default</LocalizationText>
              </Badge>
              <Badge color="gray">
                <LocalizationText>question_type_truefalse</LocalizationText>
              </Badge>
              <Badge color="gray">
                <LocalizationText>
                  question_type_one_answer_select
                </LocalizationText>
              </Badge>
              <Badge color="gray">
                <LocalizationText>
                  question_type_multiple_answers_select
                </LocalizationText>
              </Badge>
            </Flex>
            <Heading mt="2">
              <LocalizationText>step_3_done</LocalizationText>
            </Heading>
            <Text>
              <LocalizationText>step_3_done_sub</LocalizationText>
            </Text>
            <Separator size="4" mt="3" />
            <Heading size="7" mt="3">
              <LocalizationText>does_quizapp_save</LocalizationText>
            </Heading>
            <Text>
              <LocalizationText>does_quizapp_save_sub</LocalizationText>
            </Text>
            <Separator size="4" mt="3" />
            <Heading size="7" mt="3">
              <LocalizationText>
                can_i_play_quiz_no_registration
              </LocalizationText>
            </Heading>
            <Text>
              <LocalizationText>
                can_i_play_quiz_no_registration_sub
              </LocalizationText>
            </Text>
          </Text>
        </Section>
        <Section>
          <Heading size="7" align="center">
            <LocalizationText>quizapp_is_opensource</LocalizationText>
            <Link target="_blank" href="https://github.com/jzitnik-dev/quizapp">
              <LocalizationText>quizapp_is_opensource_github</LocalizationText>
            </Link>
            .
          </Heading>
        </Section>
      </Container>
    </Section>
  );
}
