import { DropdownMenu } from "@radix-ui/themes";
import {
  PersonIcon,
  StarIcon,
  GearIcon,
  ExitIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import Role from "../../types/Role";
import { LocalizationText } from "../../localization/Localization";

export default function DropdownMenuContent({
  setMobileMenuOpened,
  roles,
  logout,
  setLanguageDialog,
}: {
  setMobileMenuOpened: (e: boolean) => void;
  setLanguageDialog: (e: boolean) => void;
  logout: () => any;
  roles: Role[];
}) {
  return (
    <>
      <Link to="/me">
        <DropdownMenu.Item
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpened(false)}
        >
          <PersonIcon />
          <LocalizationText>profile</LocalizationText>
        </DropdownMenu.Item>
      </Link>
      <Link to="/me/favourites">
        <DropdownMenu.Item
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpened(false)}
        >
          <StarIcon />
          <LocalizationText>favourites</LocalizationText>
        </DropdownMenu.Item>
      </Link>
      <Link to="/me/changePassword">
        <DropdownMenu.Item
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpened(false)}
        >
          <GearIcon />
          <LocalizationText>change_password</LocalizationText>
        </DropdownMenu.Item>
      </Link>

      <DropdownMenu.Separator />

      <DropdownMenu.Item
        style={{ cursor: "pointer" }}
        onClick={() => {
          setLanguageDialog(true);
          setMobileMenuOpened(false);
        }}
      >
        <GlobeIcon /> Change language
      </DropdownMenu.Item>

      {roles.some((e) => e.name == "ROLE_ADMIN") ? (
        <>
          <DropdownMenu.Separator />

          <Link to="/admin">
            <DropdownMenu.Item style={{ cursor: "pointer" }}>
              <GearIcon />
              <LocalizationText>admin_panel</LocalizationText>
            </DropdownMenu.Item>
          </Link>
        </>
      ) : null}

      <DropdownMenu.Separator />

      <DropdownMenu.Item
        style={{ cursor: "pointer" }}
        color="red"
        onClick={() => {
          logout();
          setMobileMenuOpened(false);
        }}
      >
        <ExitIcon /> Odhlásit se
      </DropdownMenu.Item>
    </>
  );
}
