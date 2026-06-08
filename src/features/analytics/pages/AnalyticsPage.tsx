import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import InsightsSharpIcon from '@mui/icons-material/InsightsSharp';
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "../../../components/common/LoadingSkeleton";
import { CountryInsights } from "../components/CountryInsights";
import { DepartmentInsights } from "../components/DepartmentInsights";
import { JobTitleInsights } from "../components/JobTitleInsights";
import { SummaryCards } from "../components/SummaryCards";
import { useAnalyticsQuery } from "../hooks/use-analytics";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';

export function AnalyticsPage() {
  const analyticsQuery = useAnalyticsQuery();

  return (
    <>
      <Box
        sx={{
          position: "relative",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "#E4EAF3",
          background: "linear-gradient(180deg, #EFF4FF 0%, #EEF3FF 100%)",
          p: { xs: 2.25, md: 3.25 },
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: { xs: 15, md: 215 },
            bottom: 30,
            // width: { xs: 220, md: 330 },
            height: 120,
            opacity: 0.45,
            color: "#C9D7FA",
            // backgroundImage:
            //   "linear-gradient(180deg, rgba(79,126,255,0.3) 0%, rgba(79,126,255,0.05) 100%), repeating-linear-gradient(90deg, rgba(79,126,255,0.35) 0 10px, transparent 10px 22px)",
            borderTopLeftRadius: 120,
            pointerEvents: "none",
          }}
        >
          <InsightsSharpIcon sx={{ fontSize: 150 }} />
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "#5C6B86", letterSpacing: 1.2, fontWeight: 700 }}
            >
              HR CORE PLATFORM
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 0.2, fontSize: { xs: "1.8rem", md: "1.8rem" } }}
            >
              Salary Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Country, department, and job title insights
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<VisibilitySharpIcon />}
              component={Link}
              to="/employees"
              sx={{ px: 2.5, py: 1.1, minWidth: 160, borderRadius: 0.5 }}
            >
              View Employees
            </Button>
          </Box>
        </Box>
      </Box>

      {analyticsQuery.isLoading ? (
        <LoadingSkeleton rows={10} />
      ) : analyticsQuery.data ? (
        <>
          <SummaryCards summary={analyticsQuery.data.summary} />
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <CountryInsights data={analyticsQuery.data.byCountry} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <DepartmentInsights data={analyticsQuery.data.byDepartment} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <JobTitleInsights data={analyticsQuery.data.byJobTitle} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            border: "1px dashed #D8DFEA",
            borderRadius: 1,
            minHeight: { xs: 280, md: 360 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 420 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: "#EEF3FF",
                color: "#3C6FE8",
              }}
            >
              <InsightsSharpIcon />
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontSize: "1.45rem" }}>
              Analytics unavailable
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5, fontSize: "0.95rem", color: "#64748b", fontWeight: 500 }}>
              Unable to load salary insights right now.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => {
                void analyticsQuery.refetch();
              }}
              sx={{ minWidth: 126, borderRadius: 0.5 }}
            >
              Retry
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
