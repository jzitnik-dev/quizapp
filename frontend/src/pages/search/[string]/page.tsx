import {
  Container,
  Heading,
  Section,
  TextField,
  Flex,
  Button,
  Text,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import search from "../../../api/search";
import Page from "../../../types/Page";
import Quiz from "../../../components/quiz/quiz";
import User from "../../../components/user/User";

export default function Search() {
  const { string } = useParams();
  const [searchString, setSearchString] = useState(string || "");
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<Page<any>>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (string) {
      (async () => {
        const res = await search(string, page);
        setSearchData(res);
      })();
    }
  }, [string]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    navigate("/search/" + searchString);
  }

  return (
    <Section>
      <Heading size="9" align="center">
        Vyhledávání
      </Heading>
      <Container mt="5" maxWidth="600px">
        <form onSubmit={submit}>
          <TextField.Root
            placeholder="Prohledat kvízy…"
            size="3"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </form>
        <Flex direction="column" mt="4" gap="2">
          {searchData?.content.map((data) =>
            data.username !== undefined ? (
              <User user={data} />
            ) : (
              <Quiz quiz={data} />
            ),
          )}
        </Flex>
        <Flex align="center" justify="center" mt="5" gap="3">
          {!searchData?.empty && searchData !== undefined ? (
            <>
              {searchData?.first ? (
                <Button disabled={true}>Předchozí</Button>
              ) : (
                <Link to={`/discover/page/${searchData?.number}`}>
                  <Button>Předchozí</Button>
                </Link>
              )}

              <Text>{`Stránka ${(searchData?.number || 0) + 1} z ${searchData?.totalPages}`}</Text>
              {searchData?.first ? (
                <Button disabled={true}>Další</Button>
              ) : (
                <Link to={`/discover/page/${(searchData?.number || 0) + 2}`}>
                  <Button>Další</Button>
                </Link>
              )}
            </>
          ) : null}
        </Flex>
      </Container>
    </Section>
  );
}
