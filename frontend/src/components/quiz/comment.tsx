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
import { StarFilledIcon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { like, liked } from "../../api/comment";

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
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);

  useEffect(() => {
    (async () => {
      const isLikedResponse = await liked(comment.id.toString());

      setIsLiked(isLikedResponse);
    })();
  }, []);

  async function handleLike() {
    const res = await like(comment.id.toString());

    setIsLiked(res);

    if (res) {
      setLikes(n => n + 1);
    } else {
      setLikes(n => n - 1);
    }
  }

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
              <Box>
                <Flex align="center" gap="1">
                  <StarIcon />
                  <Text>{likes}</Text>
                </Flex>
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
        ) : (
          <IconButton color="yellow" onClick={handleLike}>
            {isLiked ? <StarFilledIcon /> : <StarIcon />}
          </IconButton>
        )}
      </Flex>
    </Card>
  );
}
