import {
	Drawer,
	ListItemIcon,
	List,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
	Box,
} from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export const SIDEBAR_WIDTH = 272;

interface NavItem {
	readonly label: string;
	readonly to: string;
	readonly icon: ReactNode;
}

const navItems: readonly NavItem[] = [
	// { label: "Overview", to: "/analytics", icon: <SpaceDashboardRoundedIcon /> },
	{ label: "Overview", to: "/overview", icon: <InsightsRoundedIcon /> },
	{ label: "Employees", to: "/employees", icon: <GroupRoundedIcon /> },
];

interface SidebarProps {
	readonly mobileOpen: boolean;
	readonly onCloseMobile: () => void;
	readonly isDesktop: boolean;
}

export function Sidebar({ mobileOpen, onCloseMobile, isDesktop }: SidebarProps) {
	const location = useLocation();

	const sidebarContent = (
		<>
			<Toolbar
				sx={{
					minHeight: 76,
					alignItems: "center",
					display: "flex",
					justifyContent: "flex-start",
					px: 2,
					pt: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
					<Box
						sx={{
							width: 38,
							height: 38,
							borderRadius: "50%",
							display: "grid",
							placeItems: "center",
							background: "linear-gradient(180deg, #3B82F6 0%, #1E4FD7 100%)",
						}}
					>
						<BusinessRoundedIcon sx={{ fontSize: 20 }} />
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.3 }}>
						HR Core
					</Typography>
						<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
							People Intelligence
						</Typography>
					</Box>
				</Box>
			</Toolbar>
			<Box
				sx={{
					mx: 1.5,
					mt: 1.5,
					borderTop: "1px solid rgba(255,255,255,0.18)",
				}}
			/>
			<List sx={{ px: 1.5, py: 2, display: "grid", gap: 0.75 }}>
				{navItems.map((item) => {
					const selected = location.pathname === item.to;
					return (
						<ListItemButton
							key={item.to + item.label}
							component={Link}
							to={item.to}
							selected={selected}
							sx={{
								borderRadius: 0.5,
								minHeight: 46,
								color: "rgba(241, 245, 249, 0.9)",
								fontWeight: 700,
								"& .MuiListItemIcon-root": {
									color: "inherit",
									minWidth: 32,
								},
								"&.Mui-selected": {
									background: "linear-gradient(90deg, #2A64EE 0%, #2E5FDA 100%)",
									color: "#FFFFFF",
								},
								"&:hover": {
									backgroundColor: "rgba(255,255,255,0.1)",
								},
							}}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.label} />
						</ListItemButton>
					);
				})}
			</List>

			{/* <Box sx={{ mt: "auto", px: 1.8, pb: 2 }}>
				<Box
					sx={{
						border: "1px solid rgba(255,255,255,0.12)",
						borderRadius: 1,
						p: 1.8,
						background: "rgba(10, 27, 58, 0.32)",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
						<ContactSupportRoundedIcon sx={{ fontSize: 20 }} />
						<Typography sx={{ fontWeight: 700 }}>Need help?</Typography>
					</Box>
					<Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14, mb: 1.5 }}>
						Visit our help center for guides and support.
					</Typography>
					<Button
						fullWidth
						variant="outlined"
						size="small"
						endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
						sx={{
							color: "#E5EEFF",
							borderColor: "rgba(255,255,255,0.2)",
							"&:hover": {
								borderColor: "rgba(255,255,255,0.38)",
								backgroundColor: "rgba(255,255,255,0.08)",
							},
						}}
					>
						Visit Help Center
					</Button>
				</Box>

				<Typography sx={{ mt: 1.8, opacity: 0.75, fontSize: 12, px: 0.5 }}>
					© 2025 HR Core. All rights reserved.
				</Typography>
			</Box> */}
		</>
	);

	return (
		<Drawer
			variant={isDesktop ? "permanent" : "temporary"}
			open={isDesktop ? true : mobileOpen}
			onClose={isDesktop ? undefined : onCloseMobile}
			ModalProps={{ keepMounted: true }}
			sx={{
				width: SIDEBAR_WIDTH,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: SIDEBAR_WIDTH,
					boxSizing: "border-box",
					borderRight: "none",
					background:
						"linear-gradient(180deg, #10264F 0%, #0F2E5A 48%, #12366A 100%)",
					color: "#F1F5F9",
				},
			}}
		>
			{sidebarContent}
		</Drawer>
	);
}
