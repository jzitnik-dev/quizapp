import {
  Container,
  Heading,
  Section,
  TextField,
  Flex,
  Button,
  Text,
  Spinner,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import search from "../../../api/search";
import Quiz from "../../../components/quiz/quiz";
import User from "../../../components/user/User";
import { useQuery } from "react-query";

export default function Search() {
  const { string } = useParams();
  const [searchString, setSearchString] = useState(string || "");
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const {
    data: searchData,
    refetch,
    isFetching,
  } = useQuery("search", async () => await search(string || "", page), {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    refetch();
    setSearchString(string || "");
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
        {isFetching ? (
          <Flex justify="center" mt="4">
            <Spinner size="3" />
          </Flex>
        ) : (
          <>
            <Flex direction="column" mt="4" gap="2">
              {searchData?.content.map((data, index) =>
                data.username !== undefined ? (
                  <User user={data} key={index} />
                ) : (
                  <Quiz quiz={data} key={index} />
                ),
              )}
            </Flex>
            <Flex align="center" justify="center" mt="5" gap="3">
              {!searchData?.empty && searchData !== undefined ? (
                <>
                  {searchData?.first ? (
                    <Button disabled={true}>Předchozí</Button>
                  ) : (
                    <Button onClick={() => setPage(searchData.number)}>
                      Předchozí
                    </Button>
                  )}

                  <Text>{`Stránka ${searchData.number + 1} z ${searchData.totalPages}`}</Text>
                  {searchData?.first ? (
                    <Button disabled={true}>Další</Button>
                  ) : (
                    <Button onClick={() => setPage(searchData.number + 2)}>
                      Další
                    </Button>
                  )}
                </>
              ) : null}
            </Flex>
          </>
        )}
      </Container>
    </Section>
  );
}
