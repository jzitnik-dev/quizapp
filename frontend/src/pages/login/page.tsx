import { Card, Section, Heading, Flex, Separator, TextField } from "@radix-ui/themes";

export default function Login() {
  return (
    <Section height="700px" position="relative">
      <div className="magicpattern"></div>
      <Flex align="center" justify="center">
        <Card style={{ height: "100%", width: "100%", maxWidth:"500px", maxHeight: "500px"}}>
          <Heading>Přihlášení</Heading>
          <Separator />
          <TextField.Root placeholder="username"></TextField.Root>
          <TextField.Root placeholder="password"></TextField.Root>
        </Card>
      </Flex>
    </Section>
  );
}
