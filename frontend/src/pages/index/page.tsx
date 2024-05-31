import {
  Section,
  Container,
  Heading,
  Text,
  Separator,
  Flex,
  Card,
  Link,
  Badge,
  Strong,
} from "@radix-ui/themes";
import { MouseEvent, useEffect, useRef } from "react";
import "../../styles/index.css";
import { Init, MouseMove } from "../../utils/gradient/MultiCardFlexGradient";

export default function Index() {
  const cardsFlex = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Init(cardsFlex.current);
  }, [cardsFlex]);

  return (
    <Section>
      <Container>
        <Section>
          <Flex align="center" direction="column">
            <Flex align="center" gap="2">
              <img src="/logo.png" className="h-10" />
              <Heading size="9" align="center">
                QuizAPP
              </Heading>
            </Flex>

            <Separator size="3" />
            <Text align="center" as="p" size="5">
              Vytvářejte a sdílejte kvízy s ostatními.
            </Text>
          </Flex>
        </Section>
        <Section>
          <Heading size="8" align="center">
            Proč zrovna QuizAPP?
          </Heading>
          <Flex
            gap="3"
            mt="2"
            className="flex-col md:flex-row"
            onMouseMove={(e: MouseEvent) => MouseMove(e, cardsFlex.current)}
            ref={cardsFlex}
          >
            <Card className="basis-full indexgradient">
              <Heading>Jednoduché vytváření</Heading>
              <Text mt="1" as="p">
                Jednudhé vytváření a publikování kvízu. Vytvoření kvízu Vám
                zabere jen pár minut.
              </Text>
            </Card>
            <Card className="basis-full indexgradient">
              <Heading>Ukládání odpovědí</Heading>
              <Text mt="1" as="p">
                Pokud si zahrajete kvíz, QuizAPP uloží vaše odpovědi, proto
                nikdy nepříjdete o Vaše odpovědi.
              </Text>
            </Card>
            <Card className="basis-full indexgradient">
              <Heading>Jednoduché vyhodnocení kvízu</Heading>
              <Text mt="1" as="p">
                QuizAPP vyhodnotí Vaše odpovědi a dá Vám detailní analýzu vašich
                odpovědí.
              </Text>
            </Card>
          </Flex>
        </Section>
        <Section>
          <Heading size="8" align="center">
            FAQ
          </Heading>
          <Heading size="7" mt="5">
            Jak si vytvořit svůj vlastní kvíz?
          </Heading>
          <Heading mt="2">1. Založte si účet na QuizAPP</Heading>
          <Text>
            Vytvořte si účet na QuizAPP pomoci registračního formuláře.
          </Text>{" "}
          <Link href="/signup" target="_blank">
            Otevřít registraci
          </Link>
          <Heading mt="2">2. Vytvořit si kvíz</Heading>
          <Text>
            Pomocí tlačítka vytvořit kvíz si vytvořte kvíz. Vymyslete si jméno a
            popis kvízu. Následně vložíte otázky.
            <br />
            Na výběr máte následující typy otázek:
            <Flex gap="1" wrap="wrap">
              <Badge color="gray">Výchozí</Badge>
              <Badge color="gray">Pravda / Nepravda</Badge>
              <Badge color="gray">Otázka s jednou odpovědí</Badge>
              <Badge color="gray">Otázka s několika odpověďmi</Badge>
            </Flex>
            <Heading mt="2">3. Hotovo</Heading>
            <Text>
              Nyní jste si vytvořili kvíz na QuizAPP. Nyní si kdokoliv může
              zahrát Váš kvíz.
            </Text>
            <Separator size="4" mt="3" />
            <Heading size="7" mt="3">
              Ukládá QuizAPP soukromé informace?
            </Heading>
            <Text>
              <Strong>Ne</Strong>, QuizAPP neukládá žádné soukromé informace a
              sledovací data. QuizAPP ukládá pouze list uživatelů, vytvořené
              kvízy a odpovědi uživatelů.
            </Text>
            <Separator size="4" mt="3" />
            <Heading size="7" mt="3">
              Můžu si zahrát kvíz aniž bych byl přihlášen?
            </Heading>
            <Text>
              Bohužel ne, QuizAPP potřebuje aby byl uživatel přihlášen pro
              následné uložení odpovědi do databáze.
            </Text>
          </Text>
        </Section>
      </Container>
    </Section>
  );
}
