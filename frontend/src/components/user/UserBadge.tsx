import User from "../../types/User";
import {
  HoverCard,
  Badge,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
} from "@radix-ui/themes";
import { Link } from "react-router-dom";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import parseUserPath from "../../utils/parseUserPath";

export default function UserBadge({ user }: { user?: User }) {

  if (!user) {
    return null;
  }

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Badge style={{ cursor: "pointer" }}>
          <Link to={parseUserPath(user.username)}>
            {user?.displayName}
          </Link>
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Link to={parseUserPath(user.username)}>
          <Flex gap="4">
            <Avatar
              size="3"
              fallback={user?.displayName[0] || "U"}
              radius="full"
              src={getProfilePictureUrl(user?.username || "")}
            />
            <Box>
              <Heading size="3" as="h3">
                {user?.displayName}
              </Heading>
              <Text as="div" size="2" color="gray">
                @{user?.username}
              </Text>
            </Box>
          </Flex>
        </Link>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
