import { Flex, Heading, Section, Spinner, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getRandomQuiz from "../../../api/random";

export default function Random() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const randomId = await getRandomQuiz();
      navigate("/quiz/" + randomId);
    })();
  }, []);

  return (
    <Section>
      <Heading align="center" size="9">
        Náhodný kvíz
      </Heading>
      <Text align="center" as="p" size="6" mt="2">
        Vybírám náhodný kvíz
      </Text>
      <Flex justify="center" mt="4">
        <Spinner size="3" />
      </Flex>
    </Section>
  );
}
