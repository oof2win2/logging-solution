import React, { useEffect, useState } from "react"
import { Paper, Typography, Skeleton } from "@mui/material"
import { Service, Log } from "../../types"
import LogComponent from "../Log/Log"
import ENV from "../../utils/env"

interface ServiceLogsProps {
	serviceId: number
}

const ServiceLogs: React.FC<ServiceLogsProps> = ({ serviceId }) => {
	const [service, setService] = useState<Service | null>(null)
	const [logs, setLogs] = useState<Log[]>([])
	const [logLimit, setLogLimit] = useState(100)
	const [fetchingService, setFetchingService] = useState(true)
	const [fetchingLogs, setFetchingLogs] = useState(false)

	useEffect(() => {
		const fetchService = async () => {
			const service = await fetch(
				`${ENV.REACT_APP_API_URL}/services/${serviceId}`
			).then((r) => r.json())

			setFetchingService(false)
			if (service.service) setService(service.service)
			else console.log(service)
		}
		fetchService()
	}, [])
	useEffect(() => {
		const fetchLogs = async () => {
			setFetchingLogs(true)
			const logs = await fetch(
				`${ENV.REACT_APP_API_URL}/logs/${serviceId}`,
				{
					method: "POST",
					body: JSON.stringify({
						limit: logLimit,
					}),
					headers: {
						"content-type": "application/json",
					},
				}
			).then((r) => r.json())
			if (logs.logs) setLogs(logs.logs)
			else console.log(logs)

			setFetchingLogs(false)
		}
		if (!fetchingService) fetchLogs()
	}, [fetchingService])

	console.log(service, fetchingService, fetchingLogs)
	console.log(!service, !fetchingService, !fetchingLogs)
	if (!service && !fetchingService && !fetchingLogs)
		return (
			<Paper elevation={1}>
				<Typography variant="h1">
					Service with ID {serviceId} was not found.
				</Typography>
			</Paper>
		)

	return (
		<Paper elevation={1}>
			{fetchingService && (
				<Skeleton>
					<Typography variant="h1" />
				</Skeleton>
			)}
			{service && (
				<Typography variant="h1">
					{service.name} ({service.id})
				</Typography>
			)}
			{logs.map((log, i) => (
				<LogComponent log={log} key={i} />
			))}
			{/* <Typography variant="h1">
				{(fetchingService && "Fetching service") || "Service fetched"}
			</Typography> */}
		</Paper>
	)
}
export default ServiceLogs
