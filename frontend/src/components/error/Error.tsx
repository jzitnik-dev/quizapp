import { Flex, Heading, Text } from "@radix-ui/themes";

export default function Error() {
  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      gap="3"
      direction="column"
    >
      <Heading size="9">Chyba!</Heading>
      <Text align="center">
        Nastala chyba při načítání stránky.
        <br />
        Tato chyba může nastat pokud nemáte přístup k internetu nebo je někde
        chyba v kódu.
      </Text>
    </Flex>
  );
}
