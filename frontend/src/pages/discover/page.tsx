import {
  Card,
  Section,
  Heading,
  Container,
  Text,
  Badge,
  HoverCard,
  Flex,
  Avatar,
  Box,
  TextField,
  Button,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import Quiz from "../../types/Quiz";
import QuestionType from "../../types/QuestionType";

export default function Discover() {
  const quizzes: Quiz[] = [
    {
      id: 1,
      title:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      description:
        "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      questions: [
        {
          id: 1,
          question: "pepík",
          type: QuestionType.Default,
          answer: "asdjaksd",
        },
      ],
      createDate: new Date("03/25/2015"),
      author: {
        displayName: "Jakub Žitník",
        username: "jzitnik",
        bio:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia.",
      },
    },
  ];

  return (
    <Section position="relative">
      <Container>
        <Flex mb="5" align="center" justify="between">
          <Heading size="9">Procházet</Heading>
          <Flex gap="1">
            <TextField.Root placeholder="Vyhledávat kvízy…">
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
            <Button>
              <MagnifyingGlassIcon />
            </Button>
          </Flex>
        </Flex>

        {quizzes.map((el) => (
          <Link to={`/quiz/${el.id}`}>
            <Card>
              <Heading>{el.title}</Heading>
              <Text>{el.description}</Text>
              <br />
              <HoverCard.Root>
                <HoverCard.Trigger>
                  <Link to={"/user/" + el.author.username}>
                    <Badge>{el.author.displayName}</Badge>
                  </Link>
                </HoverCard.Trigger>
                <HoverCard.Content maxWidth="300px">
                  <Link to="/user/jakub_zitnik">
                    <Flex gap="4">
                      <Avatar
                        size="3"
                        fallback="R"
                        radius="full"
                        src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
                      />
                      <Box>
                        <Heading size="3" as="h3">
                          {el.author.displayName}
                        </Heading>
                        <Text as="div" size="2" color="gray">
                          @{el.author.username}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                </HoverCard.Content>{" "}
              </HoverCard.Root>
              <Badge color="sky">{new Date(el.createDate).toLocaleDateString()}</Badge>{" "}
              <Badge color="green">
                {el.questions.length == 1
                  ? el.questions.length + " otázka"
                  : el.questions.length >= 2 && el.questions.length <= 4
                    ? el.questions.length + " otázky"
                    : el.questions.length + " otázek"}
              </Badge>
            </Card>
          </Link>
        ))}
      </Container>
    </Section>
  );
}
