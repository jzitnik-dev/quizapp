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
      width={700}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
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
