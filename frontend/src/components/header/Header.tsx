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
  Spinner,
  Dialog,
  Select,
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
import { useQuery } from "react-query";
import getRegisterAllowed from "../../api/getRegisterAllowed";
import {
  LocalizationText,
  getCurrentLang,
  useChangeLang,
} from "../../localization/Localization";
import DropdownMenuContent from "./DropdownMenuContent";

export default function Header() {
  const { data: registerAllowed, status: registerAllowedStatus } = useQuery(
    "registerAllowed",
    getRegisterAllowed,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const changeLang = useChangeLang();
  const logedIn = isLogedIn();
  const {
    userProfile,
    loading: fetching,
    error,
    setUserProfile,
  } = useUserProfile();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const [languageDialogOpened, setLanguageDialogOpened] = useState(false);
  const [languageDialogSelect, setLanguageDialogSelect] =
    useState(getCurrentLang());

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
      <Dialog.Root
        open={languageDialogOpened}
        onOpenChange={setLanguageDialogOpened}
      >
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Change language</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            <LocalizationText>change_language_sub</LocalizationText>
          </Dialog.Description>

          <Select.Root
            value={languageDialogSelect}
            onValueChange={setLanguageDialogSelect}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="en">English</Select.Item>
              <Select.Item value="cs">Čeština</Select.Item>
            </Select.Content>
          </Select.Root>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                <LocalizationText>cancel</LocalizationText>
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                onClick={() => {
                  changeLang(languageDialogSelect);
                }}
              >
                <LocalizationText>save</LocalizationText>
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

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
        roles={userProfile?.roles || []}
        registerAllowed={registerAllowed}
        setLanguageDialog={setLanguageDialogOpened}
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
        <Flex className="lg:hidden flex">
          <IconButton onClick={() => setMobileMenuOpened(!mobileMenuOpened)}>
            <HamburgerMenuIcon />
          </IconButton>
        </Flex>

        <Flex align="center" gap="3" className="hidden lg:flex">
          <TabNav.Root>
            <TabNav.Link
              href="/"
              onClick={(e) => {
                // If you reading this, sadly this is the only way to use Radix.ui TabNav.Link element with react-router-dom.
                // If i wrapped this with Link component from react-router-dom, it will cause hydration error. Yeah, react is shit.
                // Edit: No it is probably not the only way but I'm just too lazy to RTFM.
                e.preventDefault();
                navigate("/");
              }}
              active={location.pathname == "/"}
            >
              <LocalizationText>home</LocalizationText>
            </TabNav.Link>
            <TabNav.Link
              href="/discover"
              onClick={(e) => {
                e.preventDefault();
                navigate("/discover");
              }}
              active={location.pathname == "/discover"}
            >
              <LocalizationText>discover_quizzes</LocalizationText>
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
                  <QuestionMarkIcon />
                  <LocalizationText>random_quiz</LocalizationText>
                </Button>
              </Link>
              <Link to="/create">
                <Button>
                  <PlusIcon />
                  <LocalizationText>create_quiz</LocalizationText>
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
                  <DropdownMenuContent
                    setMobileMenuOpened={() => {}}
                    logout={logout}
                    roles={userProfile?.roles || []}
                    setLanguageDialog={setLanguageDialogOpened}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )
          ) : (
            <Flex gap="1">
              <Link to="/login">
                <Button>Přihlásit se</Button>
              </Link>
              {registerAllowedStatus == "loading" ? (
                <Button disabled color="gray">
                  <Spinner />
                </Button>
              ) : registerAllowed == true ? (
                <Link to="/signup">
                  <Button color="gray">Registrovat se</Button>
                </Link>
              ) : null}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
