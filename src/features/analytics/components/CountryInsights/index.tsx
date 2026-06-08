import { Card, CardContent, CardHeader } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { roundToTwo } from "@utils/number";
import { CHART_COLORS } from "../../constants";
import type { SalaryInsight } from "../../types";

interface CountryInsightsProps {
  readonly data: readonly SalaryInsight[];
}

export function CountryInsights({ data }: CountryInsightsProps) {
  const chartData = data.map((insight) => ({
    ...insight,
    minimumSalary: insight.minimumSalary ?? 0,
    maximumSalary: insight.maximumSalary ?? 0,
  }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Country Salary Insights"
        subheader="Minimum, maximum, and average salary by country"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
            <Bar dataKey="minimumSalary" name="Min Salary" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
            <Bar dataKey="averageSalary" name="Avg Salary" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
            <Bar dataKey="maximumSalary" name="Max Salary" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
