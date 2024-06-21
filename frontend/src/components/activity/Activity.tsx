import "../../styles/activity.css";
import { Tooltip } from "@radix-ui/themes";

export default function Activity() {
  const weekCount = 30;
  const totalDays = weekCount * 7;
  const date = new Date();

  const days = [];
  for (let i = 1; i <= 365; i++) {
    const level = Math.random();
    days.push(level);
  }

  const day = new Date().getDay() == 0 ? 7 : date.getDay();
  const remainingDays = [];
  for (let i = 0; i < 7 - day; i++) {
    remainingDays.push(<li key={`empty-${i}`} className="empty-day"></li>);
  }

  const realDays = [];
  for (let i = 0; i < totalDays - (7 - day); i++) {
    const daysFromNow = totalDays - (7 - day) - i - 1;
    let dayObj = new Date();
    dayObj.setDate(dayObj.getDate() - daysFromNow);
    realDays.push(
      <Tooltip content={`${dayObj.getDate()}. ${dayObj.getMonth() + 1}.`}>
        <li
          key={`real-${i}`}
          className="realday"
          style={{ opacity: days[i + 1] }}
        ></li>
      </Tooltip>,
    );
  }

  return (
    <div className="graph">
      <ul
        className="activity-grid"
        style={{ gridTemplateRows: `repeat(7, 1fr)` }}
      >
        {realDays}
        {remainingDays}
      </ul>
    </div>
  );
}
