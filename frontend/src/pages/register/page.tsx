import {
  Card,
  Section,
  Heading,
  Flex,
  TextField,
  Button,
  Callout,
  Text,
  Spinner,
} from "@radix-ui/themes";
import { FormEvent, useState, useEffect } from "react";
import register from "../../api/register";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import isLogedIn from "../../utils/logedin";
import "../../styles/register.css";
import { useQuery } from "react-query";
import getRegisterAllowed from "../../api/getRegisterAllowed";

export default function Register() {
  const { data: registerAllowed, status: registerAllowedStatus } = useQuery(
    "registerAllowed",
    getRegisterAllowed,
  );
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogedIn()) {
      navigate("/me");
    }
  }, []);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    if (password !== passwordAgain) {
      setErrorMessage("Hesla se neshodují!");
      setError(true);
      setLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 50) {
      setErrorMessage("Heslo musí mít minimálně 6 znaků a maximálně 50 znaků.");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      await register(username, passwordAgain);
      setDone(true);
    } catch (e: any) {
      setErrorMessage(e.response.data.message);
      setError(true);
      setLoading(false);
    }
  }
  return (
    <Section position="relative">
      <Flex align="center" justify="center" direction="column" gap="2">
        {error ? (
          <Callout.Root
            color="red"
            style={{
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>{errorMessage}</Callout.Text>
          </Callout.Root>
        ) : null}

        {registerAllowed == false && (
          <Callout.Root
            color="red"
            style={{
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>Registrace byla zakázána! Kontaktujte administrátora.</Callout.Text>
          </Callout.Root>
        )}

        {!done ? (
          <Card
            style={{
              height: "100%",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "400px",
              aspectRatio: "1/1",
            }}
            className="registergradient"
          >
            <form onSubmit={submitForm} style={{ height: "100%" }}>
              <Heading size="8" align="center">
                Registrace
              </Heading>
              <Flex
                direction="column"
                justify="center"
                height="calc(100% - 80px)"
              >
                <Flex gap="2" direction="column">
                  <TextField.Root
                    size="3"
                    placeholder="Uživatelské jméno"
                    value={username}
                    disabled={registerAllowed == false}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  ></TextField.Root>
                  <TextField.Root
                    type="password"
                    size="3"
                    placeholder="Heslo"
                    value={password}
                    disabled={registerAllowed == false}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  ></TextField.Root>
                  <TextField.Root
                    type="password"
                    size="3"
                    placeholder="Heslo znovu"
                    disabled={registerAllowed == false}
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    required
                  ></TextField.Root>
                </Flex>
              </Flex>
              <Flex direction="column">
                <Button size="3" disabled={loading || registerAllowed == false}>
                  {loading ? <Spinner /> : "Registrovat se"}
                </Button>
              </Flex>
            </form>
          </Card>
        ) : (
          <Callout.Root color="green">
            <Callout.Icon>
              <CheckIcon />
            </Callout.Icon>
            <Callout.Text>
              <Flex direction="column" align="center" gap="3" as="span">
                <Text>
                  Váš účet byl úspěšně zaregistrován. Nyní se můžete přihlásit.
                </Text>
                <Link to="/login">
                  <Button color="indigo">Přihlásit se</Button>
                </Link>
              </Flex>
            </Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </Section>
  );
}
