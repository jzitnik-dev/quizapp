import { Callout, Card, Flex, Heading } from "@radix-ui/themes";
import Activity from "../../types/Activity";
import User from "../../types/User";

export default function ActivityList({
  data,
  dateLook,
  user,
}: {
  data: Record<string, Activity[]>;
  dateLook: string;
  user?: User;
}) {
  const list = data[dateLook] || [];
  const date = new Date(dateLook);

  if (!user) return null;

  if (list.length == 0) {
    return (
      <Heading align="center" size="7" mt="5">
        Žádná aktivita dne {date.getDate()}. {date.getMonth() + 1}.
      </Heading>
    );
  }

  function parseText(activityType: string) {
    if (activityType == "QUIZ_CREATE") {
      return `${user?.displayName} vytvořil kvíz.`;
    }

    if (activityType == "ACCOUNT_CREATE") {
      return `${user?.displayName} si vytvořil učet na QuizAPP.`;
    }

    if (activityType == "QUIZ_PLAY") {
      return `${user?.displayName} si zahrál kvíz.`;
    }
  }

  return (
    <>
      <Heading size="7" mt="5" align="center">
        Aktivita dne {date.getDate()}. {date.getMonth() + 1}
      </Heading>
      <Flex justify="center">
        <Flex direction="column" maxWidth="500px" mt="5" gap="2">
          {list.map((e) => (
            <Card>
              <Heading align="center">{parseText(e.type)}</Heading>
            </Card>
          ))}
        </Flex>
      </Flex>
    </>
  );
}
