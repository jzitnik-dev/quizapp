import {
  Container,
  Heading,
  Section,
  Separator,
  Flex,
  Text,
  TextField,
  Button,
  Strong,
} from "@radix-ui/themes";
import { FormEvent, useEffect, useState } from "react";
import { changePassword } from "../../../api/updateProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import isLogedIn from "../../../utils/logedin";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassAgain, setNewPassAgain] = useState("");

  const navigate = useNavigate();

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    if (newPass !== newPassAgain) {
      return toast.error("Hesla se neshodují!");
    }

    let res;

    try {
      res = await changePassword(newPass, current);
      toast.success(res);
      navigate("/me");
    } catch (e: any) {
      console.log(e)
      toast.error(e.response.data);
    }
  }

  useEffect(() => {
    if (!isLogedIn()) navigate("/login");
  }, []);

  return (
    <Container maxWidth="800px">
      <Section>
        <Heading size="9">Změna hesla</Heading>
        <Separator size="4" />
        <form style={{ marginTop: "20px" }} onSubmit={submitForm}>
          <Flex direction="column" gap="3">
            <label style={{ maxWidth: "400px" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Stávající heslo
              </Text>
              <TextField.Root
                placeholder="Zadejte stávající heslo"
                type="password"
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              ></TextField.Root>
            </label>
            <label style={{ maxWidth: "400px" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Nové heslo
              </Text>
              <TextField.Root
                placeholder="Zadejte nové heslo"
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              ></TextField.Root>
              <Flex justify="between" mt="1">
                <small>
                  Minimálně <Strong>6</Strong> a maximálně <Strong>50</Strong>{" "}
                  znaků.
                </small>
              </Flex>
            </label>
            <label style={{ maxWidth: "400px" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Nové heslo znovu
              </Text>
              <TextField.Root
                placeholder="Zadejte nové heslo"
                type="password"
                required
                value={newPassAgain}
                onChange={(e) => setNewPassAgain(e.target.value)}
              ></TextField.Root>
              <Flex justify="between" mt="1">
                <small>Nové heslo znovu pro kontrolu. </small>
              </Flex>
            </label>

            <Flex justify="end">
              <Button>Změnit heslo </Button>
            </Flex>
          </Flex>
        </form>
      </Section>
    </Container>
  );
}
