import { createStyles, createTheme, Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"

export const theme = createTheme({
	palette: {
		background: {
			default: "#111111",
			paper: "#1f1f1f",
		},
	},
	typography: {
		h1: {
			fontWeight: 400,
			color: "lightgray",
		},
		body1: {
			color: "lightgray",
		},
	},
})

export const useStyles = makeStyles({
	root: {
		background: theme.palette.background.default,
	},
	p: {
		color: "#ddd9d9",
	},
	pmono: {
		color: "#ddd9d9",
		fontFamily: "Roboto Mono",
	},
})
