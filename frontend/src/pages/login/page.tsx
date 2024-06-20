import {
  Card,
  Section,
  Heading,
  Flex,
  TextField,
  Button,
  Callout,
  Spinner,
} from "@radix-ui/themes";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { FormEvent, useState, useEffect } from "react";
import login from "../../api/login";
import { useNavigate } from "react-router-dom";
import isLogedIn from "../../utils/logedin";
import "../../styles/login.css";
import { useUserProfile } from "../../components/header/UserProfileProvider";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useUserProfile();

  // Form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await login(username, password);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setUserProfile(res);
      navigate("/");
    } catch (e: any) {
      setErrorMessage(
        e.response.data.message == "Bad credentials"
          ? "Špatné uživatelské jméno nebo heslo"
          : e.message,
      );
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLogedIn()) {
      navigate("/me");
    }
  }, []);

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
        <Card
          style={{
            height: "100%",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "300px",
            aspectRatio: "1/1",
          }}
          className="logingradient"
        >
          <form onSubmit={formSubmit} style={{ height: "100%" }}>
            <Heading size="8" align="center">
              Přihlášení
            </Heading>
            <Flex
              direction="column"
              justify="center"
              height="calc(100% - 90px)"
            >
              <Flex gap="2" direction="column">
                <TextField.Root
                  size="3"
                  placeholder="Uživatelské jméno"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                ></TextField.Root>
                <TextField.Root
                  type="password"
                  size="3"
                  placeholder="Heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                ></TextField.Root>
              </Flex>
            </Flex>

            <Flex direction="column" style={{ marginTop: "10px" }}>
              <Button size="3">{loading ? <Spinner /> : "Přihlásit se"}</Button>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Section>
  );
}
