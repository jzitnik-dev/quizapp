import Activity from "../../types/Activity";

export default function groupActivitiesByDays(
  activities: Activity[],
): Record<string, Activity[]> {
  const groupedActivities: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const dateKey = activity.date.toString();

    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }

    groupedActivities[dateKey].push(activity);
  });

  return groupedActivities;
}
