import {
  LineChart,
  Line,
  YAxis,
} from "recharts";
import QuizStats from "../../types/QuizStats";

export default function QuizPlayChart({ quizData }: { quizData: QuizStats }) {
  const data = quizData.plays.map((e) => {
    return {
      plays: e,
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
        dataKey="plays"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        dot={false}
      />
    </LineChart>
  );
}
