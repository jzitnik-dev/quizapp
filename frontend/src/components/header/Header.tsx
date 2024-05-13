import { Flex, Heading, TabNav, Button } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  return (
    <Flex
      className="h-14 border-b border-gray-800 px-8"
      align="center"
      justify="between"
    >
      <Link to="/">
        <Heading>QuizAPP</Heading>
      </Link>
      <Flex align="center" gap="3">
        <TabNav.Root>
          <Link to="/">
            <TabNav.Link active={location.pathname == "/"}>Domov</TabNav.Link>
          </Link>
          <Link to="/discover">
            <TabNav.Link active={location.pathname == "/discover"}>Procházet kvízy</TabNav.Link>
          </Link>
        </TabNav.Root>
        <Flex gap="1">
          <Link to="/login">
            <Button>Přihlásit se</Button>
          </Link>
          <Link to="/signup">
            <Button color="gray">Registrovat se</Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
