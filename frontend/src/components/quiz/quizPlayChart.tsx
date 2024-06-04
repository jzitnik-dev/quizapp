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
        dataKey="plays"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        dot={false}
      />
    </LineChart>
  );
}
