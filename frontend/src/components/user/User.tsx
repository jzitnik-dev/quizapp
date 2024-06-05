import UserType from "../../types/User";
import { Link } from "react-router-dom";
import { Card, Heading, Badge, Flex, Avatar, Box } from "@radix-ui/themes";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import RolesBadge from "./RolesBadge";

export default function User({ user }: { user: UserType }) {
  return (
    <Link to={`/user/${user.username}`}>
      <Card>
        <Flex align="center" gap="2">
          <Avatar
            size="3"
            fallback={user.displayName[0]}
            radius="full"
            src={getProfilePictureUrl(user.username)}
          />
          <Box>
            <Heading>{user.displayName}</Heading>
            <Flex gap="2">
              <RolesBadge roles={user.roles} />
              <Badge>@{user.username}</Badge>
              <Badge>
                {user?.quizzes.length == 1
                  ? user.quizzes.length + " kvíz"
                  : (user?.quizzes.length || 0) >= 2 &&
                      (user?.quizzes.length || 0) <= 4
                    ? user?.quizzes.length + " kvízy"
                    : user?.quizzes.length + " kvízů"}
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </Card>
    </Link>
  );
}
