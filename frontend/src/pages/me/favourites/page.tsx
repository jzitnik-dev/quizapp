import {
  Container,
  Flex,
  Heading,
  IconButton,
  Section,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "react-query";
import QuizEl from "../../../components/quiz/quiz";
import { getFavourites, removeLiked } from "../../../api/favourites";
import { useEffect } from "react";
import isLogedIn from "../../../utils/logedin";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@radix-ui/react-icons";
import { MouseEvent } from "react";
import Quiz from "../../../types/Quiz";

export default function Favourites() {
  const navigate = useNavigate();

  const { data, status, refetch } = useQuery("favourites", getFavourites);

  useEffect(() => {
    if (!isLogedIn()) navigate("/login");
  }, []);

  async function handleRemove(
    event: MouseEvent<HTMLButtonElement>,
    quiz: Quiz | number,
  ) {
    let id;
    if (typeof quiz === "number") {
      id = quiz;
    } else {
      id = quiz.id;
    }
    event.preventDefault();
    await removeLiked(id.toString());
    refetch();
  }

  return (
    <Section>
      <Container>
        <Heading size="9">Oblíbené kvízy</Heading>
        {status == "loading" ? (
          <Flex justify="center" mt="3">
            <Spinner size="3" />
          </Flex>
        ) : data?.length == 0 ? (
          <Text as="p" align="center" mt="3">
            Nemáte žadný oblíbený kvíz
          </Text>
        ) : (
          <Flex direction="column" mt="3" gap="2">
            {data?.map((e, index) => {
              return (
                <QuizEl
                  key={index}
                  quiz={typeof e === "number" ? null : e}
                  customButton={
                    <IconButton
                      color="red"
                      onClick={(event) => handleRemove(event, e)}
                    >
                      <TrashIcon />
                    </IconButton>
                  }
                />
              );
            })}
          </Flex>
        )}
      </Container>
    </Section>
  );
}
