import { Flex, Heading, Section, Spinner, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getRandomQuiz from "../../../api/random";
import { toast } from "react-toastify";

export default function Random() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const randomId = await getRandomQuiz();
        navigate("/quiz/" + randomId);
      } catch (e: any) {
        if (e.response.status == 404) {
          toast.error("Zatím nebyl vytvořen žádný kvíz!");
          return
        }
        toast.error("Chyba: " + e.response.statusText)
      }
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
