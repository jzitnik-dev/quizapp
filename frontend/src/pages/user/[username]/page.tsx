import {
  Container,
  Section,
  Flex,
  Avatar,
  Heading,
  Card,
  Badge,
  Quote,
  Text,
} from "@radix-ui/themes";
import Quiz from "../../../types/Quiz";
import QuestionType from "../../../types/QuestionType";
import { Link } from "react-router-dom";

export default function User() {
  const quizes: Quiz[] = [
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
        userName: "jzitnik",
        email: "email@jzitnik.dev",
        about: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia."
      },
    },
  ];

  return (
    <>
      <Section>
        <Container>
          <Flex
            width="60%"
            justify="center"
            align="center"
            style={{ width: "100%" }}
          >
            <Avatar
              fallback="R"
              radius="full"
              src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
              style={{
                height: "auto",
                width: "30%",
              }}
            />
            <Card style={{ width: "50%", marginLeft: "20px" }}>
              <Heading size="9">Jakub Žitník</Heading>
              <Flex gap="2">
                <Badge>@jzitnik</Badge>
                <Badge>17 kvízů</Badge>
              </Flex>
              <br />
              <Quote>
                Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                reprehenderit enim labore culpa sint ad nisi Lorem pariatur
                mollit ex esse exercitation amet. Nisi anim cupidatat excepteur
                officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip
                amet voluptate voluptate dolor minim nulla est proident. Nostrud
                officia pariatur ut officia.
              </Quote>
            </Card>
          </Flex>
        </Container>
      </Section>
      <Section>
        <Heading align="center" size="9">
          Kvízy
        </Heading>
        <Container p="8">
          <Flex direction="column" gap="3" align="center">
            {quizes.map((el) => (
              <Link to={`/user/${el.author.userName}/quiz/${el.id}`}>
                <Card>
                  <Heading>{el.title}</Heading>
                  <Text>{el.description}</Text>
                  <br />
                  <Badge color="sky">
                    {el.createDate.toLocaleDateString()}
                  </Badge>{" "}
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
          </Flex>
        </Container>
      </Section>
    </>
  );
}
