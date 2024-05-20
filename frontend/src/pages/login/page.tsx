import {
  Card,
  Section,
  Heading,
  Flex,
  TextField,
  Button,
  Text,
  Checkbox,
} from "@radix-ui/themes";

export default function Login() {
  return (
    <Section position="relative">
      <Flex align="center" justify="center">
        <Card
          style={{
            height: "100%",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "300px",
            aspectRatio: "1/1",
          }}
        >
          <Heading size="8" align="center">
            Přihlášení
          </Heading>
          <Flex direction="column" justify="center" height="calc(100% - 110px)">
            <Flex gap="2" direction="column">
              <TextField.Root
                size="3"
                placeholder="Uživatelské jméno"
              ></TextField.Root>
              <TextField.Root
                type="password"
                size="3"
                placeholder="Heslo"
              ></TextField.Root>
            </Flex>
          </Flex>
          <Text as="label" size="2">
            <Flex gap="2">
              <Checkbox defaultChecked />
              Zůstat přihlášený
            </Flex>
          </Text>

          <Flex direction="column" style={{marginTop: "10px"}}>
            <Button size="3">Přihlásit se</Button>
          </Flex>
        </Card>
      </Flex>
    </Section>
  );
}
