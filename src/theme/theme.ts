import { createTheme } from "@mui/material/styles";

const PROFESSIONAL_FONT_STACK =
	'system-ui, -apple-system, sans-serif';

export const appTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1E4FD7",
			light: "#DCE7FF",
			dark: "#163DA9",
		},
		secondary: {
			main: "#0B8570",
		},
		text: {
			primary: "#111827",
			secondary: "#64748B",
		},
		background: {
			default: "#F4F7FC",
			paper: "#FFFFFF",
		},
		divider: "#E5EAF2",
	},
	shape: {
		borderRadius: 14,
	},
	typography: {
		fontFamily: PROFESSIONAL_FONT_STACK,
		h4: {
			fontWeight: 800,
			letterSpacing: -0.4,
		},
		h5: {
			fontWeight: 750,
			letterSpacing: -0.25,
		},
		h6: {
			fontWeight: 700,
			letterSpacing: -0.15,
		},
		body1: {
			lineHeight: 1.65,
		},
		body2: {
			lineHeight: 1.55,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundImage:
						"radial-gradient(75rem 31.25rem at -8% -20%, #e9efff 0%, rgba(233, 239, 255, 0) 70%), radial-gradient(68.75rem 26.25rem at 105% -15%, #e8fbf5 0%, rgba(232, 251, 245, 0) 68%)",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backdropFilter: "blur(0.5rem)",
					background: "rgba(255, 255, 255, 0.9)",
					borderBottom: "1px solid #E5EAF2",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow:
						"0 0.0625rem 0.125rem rgba(15, 23, 42, 0.04), 0 0.75rem 1.75rem rgba(15, 23, 42, 0.06)",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					border: "1px solid #E8EDF5",
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 700,
					borderRadius: 12,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: 650,
					borderRadius: 10,
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				size: "small",
			},
		},
	},
});
