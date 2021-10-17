// import { ThemeProvider } from "@mui/system"
import { CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"
import "./App.css"
import { theme } from "./utils/Customization"
import Services from "./pages/services/services"
import { StyledEngineProvider } from "@mui/material/styles"

import "@fontsource/roboto-mono"

function App(): JSX.Element {
	return (
		<ThemeProvider theme={theme}>
			<StyledEngineProvider injectFirst>
				<CssBaseline />
				<Services />
			</StyledEngineProvider>
		</ThemeProvider>
	)
}

export default App
