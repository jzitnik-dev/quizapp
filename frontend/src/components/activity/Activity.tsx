import "../../styles/activity.css";
import {
  Flex,
  Text,
  Tooltip,
  Section,
  Heading,
  Container,
} from "@radix-ui/themes";
import ActivityType from "../../types/Activity";
import groupActivitiesByDays from "./group";
import { useState } from "react";
import ActivityList from "./ActivityList";
import User from "../../types/User";
import { useRef, useEffect } from "react";

export default function Activity({
  activity,
  user,
}: {
  activity: ActivityType[];
  user?: User;
}) {
  const weekCount = 32;
  const totalDays = weekCount * 7;
  const date = new Date();
  const [datel, setDatel] = useState<string | undefined>();

  const data = groupActivitiesByDays(activity);
  const max = Math.max(...Object.values(data).map((e) => e.length));
  function convert(num: number) {
    return num / max;
  }

  const day = new Date().getDay() == 0 ? 7 : date.getDay();
  const remainingDays = [];
  for (let i = 0; i < 7 - day; i++) {
    remainingDays.push(<li key={`empty-${i}`} className="empty-day"></li>);
  }

  const realDays = [];
  const realDaysDate = [];
  for (let i = 0; i < totalDays - (7 - day); i++) {
    const daysFromNow = totalDays - (7 - day) - i - 1;
    let dayObj = new Date();
    dayObj.setDate(dayObj.getDate() - daysFromNow);

    const dayLook = dayObj.toISOString().split("T")[0];
    const activities = data[dayLook] || [];
    const str = `${dayObj.getDate()}.${dayObj.getMonth() + 1}. ${activities.length == 0 ? "Žádná akvitita" : "Počet aktivity: " + activities.length}`;

    realDaysDate.push(dayObj);
    realDays.push(
      <Tooltip content={str} key={`real-${i}`}>
        <li
          className="realday"
          style={{
            backgroundColor: `rgba(79, 131, 191, ${convert(activities.length)})`,
          }}
          onClick={() => setDatel(dayLook)}
        ></li>
      </Tooltip>,
    );
  }

  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, []);

  return (
    <Section>
      <Container p="8" pt="0">
        <Heading align="center" size="9">
          Aktivita
        </Heading>
        <Flex justify="center">
          <Flex className="graph" justify="center" align="center">
            <Flex gap="2" maxWidth="100vw" px="4">
              <Flex direction="column" justify="center" gap="5">
                <Text>Po</Text>
                <Text>St</Text>
                <Text>Pa</Text>
              </Flex>

              <ul
                className="activity-grid"
                style={{ gridTemplateRows: `repeat(7, 1fr)` }}
                ref={scrollContainerRef}
              >
                {realDays}
                {remainingDays}
              </ul>
            </Flex>
          </Flex>
        </Flex>
        {datel ? (
          <ActivityList data={data} dateLook={datel} user={user} />
        ) : null}
      </Container>
    </Section>
  );
}
