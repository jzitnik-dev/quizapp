import {
  Container,
  Flex,
  Heading,
  Link,
  Section,
  Text,
  Box,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const pages = [
    ["Domov", "/"],
    ["Procházet kvízy", "/discover"],
    ["Vyhledávání", "/search"]
  ];

  return (
    <Section pt="8" pb="8" className="border-t border-gray-800">
      <Container>
        <Flex justify="between">
          <Box>
            <Flex align="center" gap="2">
              <img
                src="/logo.png"
                alt="QuizAPP logo"
                style={{ height: "50px" }}
              />
              <Heading size="8">QuizAPP</Heading>
            </Flex>
            <Text mt="2" as="p" color="gray">
              Vytvářejte a sdílejte kvízy s ostatními.
            </Text>
            <Text mt="2" as="p">
              © Copyright{" "}
              <Link href="https://jzitnik.dev" target="_blank">
                Jakub Žitník
              </Link>
              . Všechna práva vyhrazena.
            </Text>
          </Box>
          <Flex align="end" direction="column">
            <Heading>Stránky</Heading>
            {pages.map((page) => (
              <Link
                href={page[1]}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(page[1]);
                }}
                style={{textAlign: "end"}}
              >
                {page[0]}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
}
