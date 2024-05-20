import {
  Card,
  Section,
  Heading,
  Flex,
  TextField,
  Button,
} from "@radix-ui/themes";

export default function Register() {
  return (
    <Section position="relative">
      <Flex align="center" justify="center">
        <Card
          style={{
            height: "100%",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "400px",
            aspectRatio: "1/1",
          }}
        >
          <Heading size="8" align="center">
            Registrace
          </Heading>
          <Flex direction="column" justify="center" height="calc(100% - 80px)">
            <Flex gap="2" direction="column">
              <TextField.Root
                size="3"
                placeholder="Uživatelské jméno"
              ></TextField.Root>
              <TextField.Root
                size="3"
                placeholder="Email"
                type="email"
              ></TextField.Root>
              <TextField.Root
                type="password"
                size="3"
                placeholder="Heslo"
              ></TextField.Root>
              <TextField.Root
                type="password"
                size="3"
                placeholder="Heslo znovu"
              ></TextField.Root>
            </Flex>
          </Flex>
          <Flex direction="column">
            <Button size="3">Register</Button>
          </Flex>
        </Card>
      </Flex>
    </Section>
  );
}
