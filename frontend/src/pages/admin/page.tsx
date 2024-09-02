import { useEffect, useState } from "react";
import isLogedIn from "../../utils/logedin";
import { useNavigate } from "react-router-dom";
import me from "../../api/me";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  Dialog,
  TextArea,
  Select,
} from "@radix-ui/themes";
import {
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import GlobalMessage from "../../types/GlobalMessage";
import {
  getGlobalMessagesRaw,
  setGlobalMessage,
} from "../../api/getGlobalMessages";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([]);
  const [globalMessagesLoading, setGlobalMessagesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    if (!isLogedIn()) {
      navigate("/login");
    }

    (async () => {
      const user = await me();
      if (!user.roles.some((e) => e.name == "ROLE_ADMIN")) {
        navigate("/");
        return;
      }

      const globalMessages = await getGlobalMessagesRaw();

      setGlobalMessages(globalMessages);

      setGlobalMessagesLoading(false);
    })();
  }, []);

  async function saveGlobalMessages() {
    setUploading(true);
    await setGlobalMessage(globalMessages);
    toast.success("Uloženo!");
    setUploading(false);
  }

  return (
    <Box mb="4">
      <Flex my="8" justify="center">
        <Heading size="8">QuizAPP - Admin Panel</Heading>
      </Flex>
      <Container size="3">
        <Flex direction="column" gap="4">
          <Box maxWidth="700px">
            <Heading>Globální informační zprávy</Heading>
            <Text color="gray">
              Globální informační zpráva je zpráva která se ukáže na úvodní
              stránce hned na začátku. Tato zpráva může být využita na sdělení
              plánované údržby apod.
            </Text>
          </Box>
          <Flex>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger>
                <Button>
                  <PlusIcon /> Přidat zprávu
                </Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="450px">
                <Dialog.Title>Vytvořit zprávu</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Zde si můžete vytvořit globální zprávu
                </Dialog.Description>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    const formData = new FormData(e.target as HTMLFormElement);
                    const type = formData.get("type");
                    let fintype = type?.toString() as
                      | "DANGER"
                      | "WARNING"
                      | "INFO";

                    if (
                      type !== "INFO" &&
                      type !== "WARNING" &&
                      type !== "DANGER"
                    ) {
                      fintype = "INFO";
                    }

                    setGlobalMessages((prevMessages) => [
                      ...prevMessages,
                      {
                        type: fintype,
                        markdownContent:
                          formData.get("content")?.toString() || "",
                      },
                    ]);

                    setOpen(false);
                  }}
                >
                  <Flex direction="column" gap="3">
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Obsah
                      </Text>
                      <TextArea
                        placeholder="Obsah zpávy v markdown"
                        resize="vertical"
                        name="content"
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Typ
                      </Text>
                      <Select.Root defaultValue="INFO" name="type">
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="INFO">Info</Select.Item>
                          <Select.Item value="WARNING">Varování</Select.Item>
                          <Select.Item value="DANGER">Nebezpečí</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </label>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Zrušit
                      </Button>
                    </Dialog.Close>
                    <Button type="submit">Přidat</Button>
                  </Flex>
                </form>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
          {globalMessagesLoading ? (
            <Flex justify="center">
              <Spinner size="3" />
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {globalMessages.map((globalMessage, index) => (
                <Card className="w-full" key={index}>
                  <Flex justify="between" align="center">
                    <Flex direction="column" gap="1">
                      <Box>
                        <Heading size="3">Obsah:</Heading>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: globalMessage.markdownContent,
                          }}
                        ></div>
                      </Box>
                      <Box>
                        <Heading size="3">Typ:</Heading>
                        <Text>{globalMessage.type}</Text>
                      </Box>
                    </Flex>
                    <Flex gap="2">
                      <Dialog.Root open={open2} onOpenChange={setOpen2}>
                        <Dialog.Trigger>
                          <IconButton>
                            <Pencil1Icon />
                          </IconButton>
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="450px">
                          <Dialog.Title>Upravit zprávu</Dialog.Title>
                          <Dialog.Description size="2" mb="4">
                            Zde si můžete upravit globální zprávu
                          </Dialog.Description>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();

                              const formData = new FormData(
                                e.target as HTMLFormElement,
                              );
                              const type = formData.get("type");
                              let fintype = type?.toString() as
                                | "DANGER"
                                | "WARNING"
                                | "INFO";

                              if (
                                type !== "INFO" &&
                                type !== "WARNING" &&
                                type !== "DANGER"
                              ) {
                                fintype = "INFO";
                              }

                              setGlobalMessages((prevMessages) =>
                                prevMessages.map((message, i) =>
                                  i === index
                                    ? {
                                        type: fintype,
                                        markdownContent:
                                          formData.get("content")?.toString() ||
                                          "",
                                      }
                                    : message,
                                ),
                              );

                              setOpen2(false);
                            }}
                          >
                            <Flex direction="column" gap="3">
                              <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                  Obsah
                                </Text>
                                <TextArea
                                  placeholder="Obsah zpávy v markdown"
                                  resize="vertical"
                                  name="content"
                                  defaultValue={globalMessage.markdownContent}
                                />
                              </label>
                              <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                  Typ
                                </Text>
                                <Select.Root
                                  defaultValue={globalMessage.type}
                                  name="type"
                                >
                                  <Select.Trigger />
                                  <Select.Content>
                                    <Select.Item value="INFO">Info</Select.Item>
                                    <Select.Item value="WARNING">
                                      Varování
                                    </Select.Item>
                                    <Select.Item value="DANGER">
                                      Nebezpečí
                                    </Select.Item>
                                  </Select.Content>
                                </Select.Root>
                              </label>
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                              <Dialog.Close>
                                <Button variant="soft" color="gray">
                                  Zrušit
                                </Button>
                              </Dialog.Close>
                              <Button type="submit">Přidat</Button>
                            </Flex>
                          </form>
                        </Dialog.Content>
                      </Dialog.Root>
                      <IconButton
                        onClick={() => {
                          setGlobalMessages((prevMessages) =>
                            prevMessages.filter((_, i) => i !== index),
                          );
                        }}
                        color="red"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
          <Flex justify="end">
            <Button color="green" onClick={() => saveGlobalMessages()}>
              {uploading ? (
                <Spinner />
              ) : (
                <>
                  <UploadIcon /> Uložit
                </>
              )}
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
