import {
  LineChart,
  Line,
  YAxis,
} from "recharts";

export default function QuizViewChart({ views }: { views: number[] }) {
  const data = views.map((e) => {
    return {
      views: e,
    };
  });
  return (
    <LineChart
      width={400}
      height={200}
      data={data}
      margin={{
        top: 5,
        right: 25,
        left: -20,
      }}
    >
      <YAxis />
      <Line
        type="monotone"
        dataKey="views"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        dot={false}
      />
    </LineChart>
  );
}
