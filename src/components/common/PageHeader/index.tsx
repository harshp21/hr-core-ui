import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
        mb: 3,
        p: { xs: 2, md: 2.5 },
        borderRadius: 1,
        background:
          "linear-gradient(135deg, rgba(30,79,215,0.07) 0%, rgba(11,133,112,0.08) 100%)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
          HR Core Platform
        </Typography>
        <Typography variant="h5">{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Box>
  );
}
