import { Grid } from "@mui/material";
import { StatCard } from "../../../../components/common/StatCard";
import type { AnalyticsSummary } from "../../types";

interface SummaryCardsProps {
  readonly summary: AnalyticsSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          label="Total Employees"
          value={String(summary.totalEmployees)}
          hint="Total workforce on record"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          label="Active Employees"
          value={String(summary.activeEmployees)}
          hint="Current active employment"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          label="Average Salary"
          value={summary.averageSalary.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          })}
          hint="Average compensation benchmark"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          label="Total Payroll"
          value={summary.totalPayroll.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          })}
          hint="Estimated gross payroll"
        />
      </Grid>
    </Grid>
  );
}
