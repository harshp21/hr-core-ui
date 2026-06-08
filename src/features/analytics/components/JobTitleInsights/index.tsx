import { Card, CardContent, CardHeader } from "@mui/material";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { roundToTwo } from "@utils/number";
import { CHART_COLORS } from "../../constants";
import type { SalaryInsight } from "../../types";

interface JobTitleInsightsProps {
  readonly data: readonly SalaryInsight[];
}

export function JobTitleInsights({ data }: JobTitleInsightsProps) {
  return (
    <Card>
      <CardHeader
        title="Job Title Salary Insights"
        subheader="Average salary by role"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EDF6" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value ?? 0);

                return roundToTwo(numericValue).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                });
              }}
            />
            <Line
              type="monotone"
              dataKey="averageSalary"
              stroke={CHART_COLORS[1]}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
