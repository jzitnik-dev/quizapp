import {
  Container,
  Section,
  Flex,
  Avatar,
  Heading,
  Card,
  Badge,
  Quote,
  Text,
  Button,
  Dialog,
  TextField,
  Skeleton,
  TextArea,
} from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import me from "../../api/me";
import isLogedIn from "../../utils/logedin";
import { UploadIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import updateMe from "../../api/updateProfile";
import updateProfilePicture from "../../api/updateProfilePicture";
import getProfilePictureUrl from "../../api/getProfilePictureUrl";
import Quiz from "../../components/quiz/quiz";
import RolesBadge from "../../components/user/RolesBadge";
import { useUserProfile } from "../../components/header/UserProfileProvider";
import { getFinished } from "../../api/getUser";
import { useQuery } from "react-query";

export default function Me() {
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const { setUserProfile } = useUserProfile();
  const { data } = useQuery("me", me);
  const { data: finished, status } = useQuery(
    ["finished", data],
    async () => await getFinished(data?.username || ""),
  );

  // Form data
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [bio, setBio] = useState<string | undefined>();

  const quizzesReverse = useMemo(() => {
    if (data && data.quizzes) {
      return [...data.quizzes].reverse();
    }
    return [];
  }, [data?.quizzes]);

  async function submitChanges() {
    let xbio = bio;
    let xdisplayName = displayName;
    if (bio === undefined) {
      xbio = data?.bio;
    }
    if (displayName === undefined) {
      xdisplayName = data?.displayName;
    }

    if (xdisplayName?.length == 0) {
      return toast.error("Uživatelské jméno nesmí být prázdné.");
    }

    if (xbio?.length == 0) xbio = undefined;

    try {
      const response = await updateMe(xdisplayName || "", xbio || "");

      if (fileUploaded && input.current?.files && input.current.files[0]) {
        await updateProfilePicture(input.current?.files[0]);
      }

      navigate("/");
      toast.success(response);
      setUserProfile({
        username: data?.username || "",
        displayName: xdisplayName || "",
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    if (!isLogedIn()) navigate("/login");
  }, []);

  return (
    <>
      <Section>
        <input
          ref={input}
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={() => setFileUploaded(true)}
        />
        <Container>
          <Flex
            width="60%"
            justify="center"
            align="center"
            style={{ width: "100%" }}
            className="flex-col gap-4 md:flex-row"
          >
            <Avatar
              fallback={data?.username[0] || "U"}
              radius="full"
              src={getProfilePictureUrl(data?.username || "")}
              size="9"
              style={{
                height: "auto",
                aspectRatio: "1/1",
              }}
              className="w-3/4 sm:w-1/2 md:w-1/3"
            />
            <Card className="w-5/6 md:w-1/2">
              <Heading size="9">
                {status === "loading" ? (
                  <Skeleton height="50px" width="250px" />
                ) : (
                  data?.displayName
                )}
              </Heading>
              <Flex gap="2" wrap="wrap">
                {status === "loading" || !data?.roles ? null : (
                  <RolesBadge roles={data?.roles} />
                )}
                <Badge>
                  {status === "loading" ? (
                    <Skeleton height="20px" width="60px" />
                  ) : (
                    `@${data?.username}`
                  )}
                </Badge>
                <Badge>
                  {status === "loading" ? (
                    <Skeleton height="20px" width="50px" />
                  ) : data?.quizzes.length == 1 ? (
                    data.quizzes.length + " kvíz"
                  ) : (data?.quizzes.length || 0) >= 2 &&
                    (data?.quizzes.length || 0) <= 4 ? (
                    data?.quizzes.length + " kvízy"
                  ) : (
                    data?.quizzes.length + " kvízů"
                  )}
                </Badge>
                <Badge color="green">
                  {status === "loading" ? (
                    <Skeleton height="20px" width="50px" />
                  ) : finished == 1 ? (
                    "Dokončil " + finished + " kvíz"
                  ) : (finished || 0) >= 2 && (finished || 0) <= 4 ? (
                    "Dokončil " + finished + " kvízy"
                  ) : (
                    "Dokončil " + finished + " kvízů"
                  )}
                </Badge>
              </Flex>

              {status === "loading" ? (
                <Skeleton height="118px" />
              ) : data?.bio ? (
                <>
                  <br />
                  <Quote>{data?.bio}</Quote>
                </>
              ) : null}

              <br />
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button>Upravit profil</Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Title>Upravit profil</Dialog.Title>
                  <Dialog.Description>
                    Vytvořit změny ve vašem profilu.
                  </Dialog.Description>

                  <Flex direction="column" gap="3">
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Zobrazované jméno
                      </Text>
                      <TextField.Root
                        defaultValue={data?.displayName}
                        placeholder="Zadejte zobrazované jméno"
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Bio
                      </Text>
                      <TextArea
                        defaultValue={data?.bio}
                        placeholder="Zadejte bio"
                        style={{ resize: "vertical" }}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Profilový obrázek
                      </Text>
                      <Button
                        color="gray"
                        highContrast
                        variant="soft"
                        onClick={() => input.current?.click()}
                      >
                        <UploadIcon />
                        Nahrát obrázek
                      </Button>
                    </label>
                  </Flex>
                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close onClick={submitChanges}>
                      <Button>Save</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Card>
          </Flex>
        </Container>
      </Section>
      <Section>
        <Heading align="center" size="9">
          Kvízy
        </Heading>
        <Container p="8">
          <Flex direction="column" gap="3" align="center">
            {data?.quizzes.length !== 0 ? (
              quizzesReverse.map((el, index) => <Quiz quiz={el} key={index} />)
            ) : (
              <>
                <Heading>Nemáte zatím vytvořený žádný kvíz</Heading>
                <Link to="/create">
                  <Button>Vytvořit svůj první kvíz</Button>
                </Link>
              </>
            )}
          </Flex>
        </Container>
      </Section>
    </>
  );
}
