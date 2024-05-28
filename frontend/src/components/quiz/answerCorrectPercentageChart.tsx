import { BarChart, XAxis, YAxis, Bar, Tooltip } from "recharts";
import QuizStats from "../../types/QuizStats";
import { Text } from "@radix-ui/themes";

type DataItem = {
  name: string;
  percentage: number;
};

type Data = DataItem[];

export default function AnswerCorrectPercentageChart({
  quizData,
}: {
  quizData: QuizStats;
}) {
  const data: Data = [];
  const questions: String[] = [];

  for (var i = 0; i < quizData.questions.length; i++) {
    const question = quizData.questions[i];
    questions.push(question);
    const percentage = quizData.percentages[i];
    data.push({
      name: (i + 1).toString(),
      percentage: percentage,
    });
  }

  const renderYAxisTick = (value: any) => {
    return `${value}%`;
  };

  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2 rounded-md"
          style={{ background: "var(--color-background)" }}
        >
          <Text as="p" style={{ maxWidth: "250px" }}>
            <strong>Otázka: </strong>
            {questions[label - 1]}
          </Text>
          <br />
          <Text as="p">
            <strong>Úspěšnost: </strong>
            {payload[0].value}%
          </Text>
        </div>
      );
    }

    return null;
  }

  return (
    <BarChart
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
      <XAxis dataKey="name" />
      <YAxis tickFormatter={renderYAxisTick} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />

      <Bar dataKey="percentage" fill="#3e63dd" />
    </BarChart>
  );
}
