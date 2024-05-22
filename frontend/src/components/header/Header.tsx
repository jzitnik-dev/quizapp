import {
  Flex,
  Heading,
  TabNav,
  Button,
  Avatar,
  DropdownMenu,
  Text,
  Skeleton,
} from "@radix-ui/themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import isLogedIn from "../../utils/logedin";
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { meHeader } from "../../api/me";
import User from "../../types/User";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const logedIn = isLogedIn();
  const [name, setName] = useState("");

  useEffect(() => {
    const fun = async () => {
      if (!logedIn) return;
      const response = (await meHeader()) as User;
      setName(response.displayName);
      setFetching(false);
    };
    fun();

    const id = setInterval(fun, 1000);

    return () => {
      clearInterval(id);
    };
  }, [logedIn]);

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/");
  }

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
        {logedIn ? (
          <Link to="/create">
            <Button>
              <PlusIcon />
              Vytvořit kvíz
            </Button>
          </Link>
        ) : null}
        {logedIn ? (
          fetching ? (
            <Flex align="center" gap="2">
              <Avatar size="3" fallback="" radius="full" />
              <Flex align="center">
                <Skeleton width="90px" height="20px" />
                <CaretDownIcon height="25px" width="25px" />
              </Flex>
            </Flex>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Flex align="center" gap="2" style={{ cursor: "pointer" }}>
                  <Avatar
                    size="3"
                    fallback=""
                    radius="full"
                    src="https://jzitnik.dev/images/instagram_profile_picture.jpg"
                  />
                  <Flex align="center">
                    <Text>{name}</Text>
                    <CaretDownIcon height="25px" width="25px" />
                  </Flex>
                </Flex>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <Link to="/me">
                  <DropdownMenu.Item style={{ cursor: "pointer" }}>
                    Profil
                  </DropdownMenu.Item>
                </Link>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  style={{ cursor: "pointer" }}
                  color="red"
                  onClick={logout}
                >
                  Odhlásit se
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )
        ) : (
          <Flex gap="1">
            <Link to="/login">
              <Button>Přihlásit se</Button>
            </Link>
            <Link to="/signup">
              <Button color="gray">Registrovat se</Button>
            </Link>
          </Flex>
        )}{" "}
      </Flex>
    </Flex>
  );
}
