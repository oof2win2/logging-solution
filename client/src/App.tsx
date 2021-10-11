// import { ThemeProvider } from "@mui/system"
import { CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"
import "./App.css"
import { theme } from "./utils/Customization"
import ServiceLogs from "./components/ServiceLogs/ServiceLogs"

import "@fontsource/roboto-mono"

function App(): JSX.Element {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ServiceLogs serviceId={1} />
		</ThemeProvider>
	)
}

export default App
