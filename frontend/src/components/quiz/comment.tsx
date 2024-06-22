import {
  Card,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
} from "@radix-ui/themes";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import CommentType from "../../types/Comment";
import { Link } from "react-router-dom";
import parseUserPath from "../../utils/parseUserPath";
import { useUserProfile } from "../header/UserProfileProvider";
import { TrashIcon } from "@radix-ui/react-icons";

export default function Comment({
  comment,
  handleRemove,
}: {
  comment: CommentType;
  handleRemove: () => any;
}) {
  const { userProfile } = useUserProfile();
  const own =
    userProfile &&
    userProfile.username.trim() == comment.author.username.trim();

  return (
    <Card style={{ maxWidth: "500px", width: "100%" }}>
      <Flex align="center" justify="between">
        <Box>
          <Link to={parseUserPath(comment.author.username)}>
            <Flex gap="4">
              <Avatar
                size="3"
                fallback={comment.author.displayName[0] || "U"}
                radius="full"
                src={getProfilePictureUrl(comment.author.username)}
              />
              <Box>
                <Heading size="3" as="h3">
                  {comment.author?.displayName}
                </Heading>
                <Text as="div" size="2" color="gray">
                  @{comment.author?.username}
                </Text>
              </Box>
            </Flex>
          </Link>
          <Text mt="4" as="p">
            {comment.content}
          </Text>
        </Box>
        {own ? (
          <IconButton color="red" onClick={handleRemove}>
            <TrashIcon />
          </IconButton>
        ) : null}
      </Flex>
    </Card>
  );
}
