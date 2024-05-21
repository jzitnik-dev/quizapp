import { Flex, Heading, TabNav, Button } from "@radix-ui/themes";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
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
          <TabNav.Link
            href="/"
            onClick={(e) => {
              // If you reading this, sadly this is the only way to use Radix.ui TabNav.Link element with react-router-dom.
              // If i wrapped this with Link component from react-router-dom, it will cause hydration error. Yeah, react is shit.
              e.preventDefault();
              navigate("/");
            }}
            active={location.pathname == "/"}
          >
            Domov
          </TabNav.Link>
          <TabNav.Link
            href="/discover"
            onClick={(e) => {
              e.preventDefault();
              navigate("/discover");
            }}
            active={location.pathname == "/discover"}
          >
            Procházet kvízy
          </TabNav.Link>
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
