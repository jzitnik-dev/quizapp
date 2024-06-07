import { Button, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Section>
      <Heading size="9" align="center">
        404
      </Heading>
      <Heading size="8" align="center">
        Nenalezeno!
      </Heading>
      <Text align="center" as="p">
        Tato stránka nebyla nalezena!
      </Text>
      <Flex justify="center" mt="5">
        <Link to="/">
          <Button>Zpět domů</Button>
        </Link>
      </Flex>
    </Section>
  );
}
