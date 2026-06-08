import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 650 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, letterSpacing: -0.25 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {hint ?? "Updated from current dataset"}
        </Typography>
      </CardContent>
    </Card>
  );
}
