import { Card, CardContent, CardHeader } from "@mui/material";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../../constants";
import type { SalaryInsight } from "../../types";
import { roundToTwo } from "@utils/number";

interface DepartmentInsightsProps {
  readonly data: readonly SalaryInsight[];
}

export function DepartmentInsights({ data }: DepartmentInsightsProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Department Salary Insights"
        subheader="Compensation distribution by function"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="averageSalary" nameKey="label" outerRadius={94}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value ?? 0);

                return roundToTwo(numericValue).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                });
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
