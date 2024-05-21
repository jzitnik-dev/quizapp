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
import Quiz from "../../types/Quiz";
import User from "../../types/User";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import me from "../../api/me";
import isLogedIn from "../../utils/logedin";
import { UploadIcon } from "@radix-ui/react-icons";
import { ToastContainer, toast } from "react-toastify";
import updateMe from "../../api/updateProfile";

export default function Me() {
  const quizes: Quiz[] = [];
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<User | undefined>();

  // Form data
  const [username, setUsername] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [bio, setBio] = useState<string | undefined>();

  async function submitChanges() {
    let xusername = username;
    let xbio = bio;
    let xdisplayName = displayName;
    if (username === undefined) {
      xusername = data?.username;
    }
    if (bio === undefined) {
      xbio = data?.bio;
    }
    if (displayName === undefined) {
      xdisplayName = data?.displayName;
    }

    if (xdisplayName?.length == 0) {
      return toast.error("Uživatelské jméno nesmí být prázdné.");
    }
    if (xusername?.length == 0) {
      return toast.error("Uživatelské jméno nesmí být prázdné.");
    }

    if (xbio?.length == 0) xbio = undefined;

    const response = await updateMe(xusername || "", xdisplayName || "", xbio || "");

    if (data) {
      data.username = username || "";
      data.displayName = displayName || "";
      data.bio = bio || "";
    }

    navigate("/")

    toast.success(response);
  }

  useEffect(() => {
    if (!isLogedIn()) navigate("/");

    (async () => {
      const response = (await me()) as User;
      setFetching(false);
      setData(response);
    })();
  }, []);

  return (
    <>
      <Section>
        <Container>
          <Flex
            width="60%"
            justify="center"
            align="center"
            style={{ width: "100%" }}
          >
            <Avatar
              fallback={data?.username[0] || "U"}
              radius="full"
              src="https://jzitnik.dev/images/instagram_profile_picture.jpg"
              size="9"
              style={{
                height: "auto",
                width: "30%",
                aspectRatio: "1/1",
              }}
            />
            <Card style={{ width: "50%", marginLeft: "20px" }}>
              <Heading size="9">
                {fetching ? (
                  <Skeleton height="50px" width="250px" />
                ) : (
                  data?.displayName
                )}
              </Heading>
              <Flex gap="2">
                <Badge>
                  {fetching ? (
                    <Skeleton height="20px" width="60px" />
                  ) : (
                    `@${data?.username}`
                  )}
                </Badge>
                <Badge>
                  {fetching ? (
                    <Skeleton height="20px" width="50px" />
                  ) : (
                    `17 kvízů`
                  )}
                </Badge>
              </Flex>

              <br />
              {fetching ? (
                <Skeleton height="118px" />
              ) : data?.bio ? (
                <>
                  <Quote>{data?.bio}</Quote>
                  <br />
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
                        Uživatelské jméno
                      </Text>
                      <TextField.Root
                        defaultValue={data?.username}
                        placeholder="Zadejte uživatelské jméno"
                        onChange={(e) => setUsername(e.target.value)}
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
                      <Button color="gray" highContrast variant="soft">
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
            {quizes.map((el) => (
              <Link to={`/user/${el.author.username}/quiz/${el.id}`}>
                <Card>
                  <Heading>{el.title}</Heading>
                  <Text>{el.description}</Text>
                  <br />
                  <Badge color="sky">
                    {el.createDate.toLocaleDateString()}
                  </Badge>{" "}
                  <Badge color="green">
                    {el.questions.length == 1
                      ? el.questions.length + " otázka"
                      : el.questions.length >= 2 && el.questions.length <= 4
                        ? el.questions.length + " otázky"
                        : el.questions.length + " otázek"}
                  </Badge>
                </Card>
              </Link>
            ))}
          </Flex>
        </Container>
      </Section>
    </>
  );
}
