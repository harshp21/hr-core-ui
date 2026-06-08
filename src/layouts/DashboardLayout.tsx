import {
	AppBar,
	Avatar,
	// Badge,
	Box,
	IconButton,
	Toolbar,
	Typography,
	useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
// import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

const pageTitles: Record<string, string> = {
	// "/": "Overview",
	"/overview": "Analytics Dashboard",
	"/analytics": "Analytics Dashboard",
	"/employee": "Employee Management",
	"/employees": "Employee Management",
};

export function DashboardLayout() {
	const location = useLocation();
	const title = pageTitles[location.pathname] ?? "HR Core";
	const isDesktop = useMediaQuery("(min-width:68.75rem)");
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			<Sidebar
				mobileOpen={mobileOpen}
				onCloseMobile={() => setMobileOpen(false)}
				isDesktop={isDesktop}
			/>
			<Box
				sx={{
					flexGrow: 1,
					ml: { xs: 0 },
					minWidth: 0,
				}}
			>
				<AppBar position="sticky" color="inherit" elevation={0}>
					<Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
						<IconButton
							onClick={() => setMobileOpen(true)}
							sx={{ display: { xs: "inline-flex", lg: "none" }, mr: 1 }}
						>
							<MenuRoundedIcon />
						</IconButton>

						<Box>
							<Typography variant="h6">{title}</Typography>
							<Typography variant="body2" color="text.secondary">
								Operational HR workspace
							</Typography>
						</Box>

						{/* <TextField
							placeholder="Search people, teams, countries"
							size="small"
							sx={{
								ml: 2,
								maxWidth: 420,
								flex: 1,
								display: { xs: "none", md: "block" },
								"& .MuiOutlinedInput-root": {
									borderRadius: 999,
									backgroundColor: "#F8FAFD",
								},
							}}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<SearchRoundedIcon fontSize="small" />
										</InputAdornment>
									),
								},
							}}
						/> */}

						<Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
							{/* <IconButton>
								<Badge color="error" badgeContent={3} max={9}>
									<NotificationsNoneRoundedIcon />
								</Badge>
							</IconButton> */}
							<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
								<Avatar
									sx={{
										width: 34,
										height: 34,
										backgroundColor: "primary.main",
										fontSize: 14,
									}}
								>
									HR
								</Avatar>
								<Typography sx={{ fontWeight: 700, display: { xs: "none", md: "block" } }}>
									HR Admin
								</Typography>
								<KeyboardArrowDownRoundedIcon sx={{ color: "text.secondary" }} />
							</Box>
						</Box>
					</Toolbar>
				</AppBar>
				<Box
					component="main"
					sx={{
						px: { xs: 2, md: 3, xl: 4 },
						py: { xs: 2, md: 3 },
						maxWidth: 1600,
						// mx: "auto",
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
