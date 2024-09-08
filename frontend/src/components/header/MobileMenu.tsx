import {
  Box,
  Flex,
  DropdownMenu,
  Avatar,
  Text,
  Skeleton,
} from "@radix-ui/themes";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CaretDownIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import Role from "../../types/Role";
import { LocalizationText } from "../../localization/Localization";
import DropdownMenuContent from "./DropdownMenuContent";

export default function MobileMenu({
  fetching,
  logedIn,
  mobileMenuOpened,
  setMobileMenuOpened,
  name,
  username,
  roles,
  logout,
  registerAllowed,
  setLanguageDialog
}: {
  fetching: boolean;
  logedIn: boolean;
  mobileMenuOpened: boolean;
  setMobileMenuOpened: (value: boolean) => any;
  setLanguageDialog: (value: boolean) => any;
  name: string;
  username: string;
  roles: Role[];
  logout: () => any;
  registerAllowed: boolean | undefined;
}) {
  return (
    <Box
      position="fixed"
      className={"right-0 mobile-menu " + (mobileMenuOpened ? "active" : "")}
      style={{ backgroundColor: "var(--gray-2)" }}
    >
      <Flex height="100%" direction="column" justify="center" gap="15px">
        <Link onClick={() => setMobileMenuOpened(false)} to="/">
          <LocalizationText>home</LocalizationText>
        </Link>
        <Link onClick={() => setMobileMenuOpened(false)} to="/discover">
          <LocalizationText>discover_quizzes</LocalizationText>
        </Link>
        <Link onClick={() => setMobileMenuOpened(false)} to="/search">
          <Flex align="center" justify="center" gap="2">
            <MagnifyingGlassIcon height="30px" width="30px" />{" "}
            <LocalizationText>search</LocalizationText>
          </Flex>
        </Link>
        {logedIn ? (
          <>
            <Link onClick={() => setMobileMenuOpened(false)} to="/quiz/random">
              <Flex align="center" justify="center" gap="2">
                <QuestionMarkIcon height="30px" width="30px" />{" "}
                <LocalizationText>random_quiz</LocalizationText>
              </Flex>
            </Link>
            <Link onClick={() => setMobileMenuOpened(false)} to="/create">
              <Flex align="center" justify="center" gap="2">
                <PlusIcon height="30px" width="30px" />{" "}
                <LocalizationText>create_quiz</LocalizationText>
              </Flex>
            </Link>
          </>
        ) : null}

        {logedIn ? (
          fetching ? (
            <Flex align="center" justify="center" gap="2">
              <Avatar size="3" fallback="" radius="full" />
              <Flex align="center">
                <Skeleton width="90px" height="20px" />
                <CaretDownIcon height="25px" width="25px" />
              </Flex>
            </Flex>
          ) : (
            <Flex justify="center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Flex
                    align="center"
                    justify="center"
                    gap="2"
                    style={{ cursor: "pointer" }}
                  >
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
                    setMobileMenuOpened={setMobileMenuOpened}
                    roles={roles}
                    logout={logout}
                    setLanguageDialog={setLanguageDialog}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          )
        ) : (
          <>
            <Link onClick={() => setMobileMenuOpened(false)} to="/login">
              Přihlásit se
            </Link>

            {registerAllowed == true ? (
              <Link onClick={() => setMobileMenuOpened(false)} to="/signup">
                Registrovat se
              </Link>
            ) : null}
          </>
        )}
      </Flex>
    </Box>
  );
}
