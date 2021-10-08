import { ThemeProvider } from "@mui/system"
import React from "react"
import "./App.css"
import { theme } from "./utils/Customization"
import ServiceLogs from "./components/ServiceLogs/ServiceLogs"

import "@fontsource/roboto-mono"

function App() {
	return (
		<ThemeProvider theme={theme}>
			<ServiceLogs serviceId={1} />
		</ThemeProvider>
	)
}

export default App
