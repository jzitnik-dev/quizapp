import {
  Flex,
  Heading,
  TabNav,
  Button,
  Avatar,
  DropdownMenu,
  Text,
  Skeleton,
  IconButton,
  Box,
} from "@radix-ui/themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import isLogedIn from "../../utils/logedin";
import {
  CaretDownIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import MobileMenu from "./MobileMenu";
import { useUserProfile } from "./UserProfileProvider";
import { toast } from "react-toastify";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const logedIn = isLogedIn();
  const {
    userProfile,
    loading: fetching,
    error,
    setUserProfile,
  } = useUserProfile();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  const name = userProfile?.displayName || "";
  const username = userProfile?.username || "";

  function logout() {
    localStorage.removeItem("accessToken");
    setUserProfile(null);
    navigate("/");
  }

  if (error) {
    toast.error("Chyba: " + error.message);
  }

  return (
    <Box>
      <Box
        position="fixed"
        className={
          "w-screen bg-black transition-opacity z-10 " +
          (mobileMenuOpened ? "opacity-70" : "opacity-0 pointer-events-none")
        }
        style={{ height: "calc(100vh - 50px)", top: "50px" }}
        onClick={() => setMobileMenuOpened(false)}
      />
      <MobileMenu
        fetching={fetching}
        logedIn={logedIn}
        mobileMenuOpened={mobileMenuOpened}
        setMobileMenuOpened={setMobileMenuOpened}
        name={name}
        username={username}
        logout={logout}
      />

      <Flex
        className="h-14 border-b border-gray-800 px-8 z-20"
        align="center"
        justify="between"
        position="fixed"
        width="100vw"
        top="0"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Link to="/">
          <Heading>
            <Flex gap="3" align="center">
              <img src="/logo.png" className="h-8" />
              QuizAPP
            </Flex>
          </Heading>
        </Link>
        <Flex className="md:hidden flex">
          <IconButton onClick={() => setMobileMenuOpened(!mobileMenuOpened)}>
            <HamburgerMenuIcon />
          </IconButton>
        </Flex>

        <Flex align="center" gap="3" className="hidden md:flex">
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
          <Link to="/search">
            <IconButton>
              <MagnifyingGlassIcon />
            </IconButton>
          </Link>
          {logedIn ? (
            <>
              <Link to="/quiz/random">
                <Button>
                  <QuestionMarkIcon/>
                  Náhodný kvíz
                </Button>
              </Link>
              <Link to="/create">
                <Button>
                  <PlusIcon />
                  Vytvořit kvíz
                </Button>
              </Link>
            </>
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
                      fallback={name[0]}
                      radius="full"
                      src={getProfilePictureUrl(username)}
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
                  <Link to="/me/changePassword">
                    <DropdownMenu.Item style={{ cursor: "pointer" }}>
                      Změnit heslo
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
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
