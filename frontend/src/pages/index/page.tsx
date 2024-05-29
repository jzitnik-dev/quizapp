import {
  Section,
  Container,
  Heading,
  Text,
  Separator,
  Flex,
} from "@radix-ui/themes";

export default function Index() {
  return (
    <Section>
      <Container>
        <Section>
          <Flex align="center" direction="column">
            <Flex align="center" gap="2">
              <img src="/logo.png" className="h-10" />
              <Heading size="9" align="center">
                QuizAPP
              </Heading>{" "}
            </Flex>

            <Separator size="3" />
            <Text align="center" as="p" size="5">
              Vytvářejte a sdílejte kvízy mezi ostatními.
            </Text>
          </Flex>
        </Section>
        <Text size="5">
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
          enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
          exercitation amet. Nisi anim cupidatat excepteur officia.
          Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
          voluptate dolor minim nulla est proident. Nostrud officia pariatur ut
          officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate.
          Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis
          officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
          sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea
          consectetur et est culpa et culpa duis.
        </Text>
      </Container>
    </Section>
  );
}
