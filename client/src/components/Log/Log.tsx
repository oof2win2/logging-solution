import { Typography } from "@mui/material"
import React from "react"
import { Log } from "../../types"

interface LogProps {
	log: Log
}

const LogComponent: React.FC<LogProps> = ({ log }) => {
	return (
		<div>
			<Typography
				style={{ fontFamily: "Roboto Mono", display: "inline" }}
			>
				{new Date(log.createdAt).toISOString()}
			</Typography>
			<Typography style={{ display: "inline" }}></Typography>
			<Typography
				style={{ fontFamily: "Roboto Mono", display: "inline" }}
			>
				{log.data}
			</Typography>
		</div>
	)
}
export default LogComponent
