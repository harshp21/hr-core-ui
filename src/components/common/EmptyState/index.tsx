import { Box, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 8, md: 11 },
        px: 2,
        border: "1px solid #E4EAF3",
        borderRadius: 1,
        backgroundColor: "#FFFFFF",
        minHeight: { xs: 300, md: 370 },
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box>
        <Box
          sx={{
            width: 90,
            height: 90,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(circle at 30% 25%, #EFF4FF 0%, #E4EEFF 60%, #DDE9FF 100%)",
            color: "#7CA3F3",
          }}
        >
          <PeopleAltOutlinedIcon sx={{ fontSize: 44 }} />
        </Box>
        <Typography variant="h4" sx={{ mb: 0.8, fontSize: "1.45rem" }}>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, color: "#64748b", fontSize: { xs: "0.95rem", md: "0.95rem" } }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
