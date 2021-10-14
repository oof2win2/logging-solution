import React, { useEffect, useState } from "react"
import {
	Paper,
	Typography,
	Skeleton,
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableContainer,
} from "@mui/material"
import { Service, Log } from "../../types"
import dayjs from "dayjs"
import ENV from "../../utils/env"
import { useStyles } from "../../utils/Customization"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

interface ServiceLogsProps {
	serviceId: number
}

const ServiceLogs: React.FC<ServiceLogsProps> = ({ serviceId }) => {
	const [service, setService] = useState<Service | null>(null)
	const [logs, setLogs] = useState<Log[]>([])
	const [logLimit, setLogLimit] = useState(100)
	const [fetchingService, setFetchingService] = useState(true)
	const [fetchingLogs, setFetchingLogs] = useState(false)
	const styles = useStyles()

	useEffect(() => {
		const fetchService = async () => {
			const service = await fetch(
				`${ENV.REACT_APP_API_URL}/services/${serviceId}`
			).then((r) => r.json())

			setFetchingService(false)
			if (service.service) setService(service.service)
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

			setFetchingLogs(false)
		}
		if (!fetchingService) fetchLogs()
	}, [fetchingService])

	if (!service && !fetchingService && !fetchingLogs)
		return (
			<Paper elevation={1}>
				<Typography variant="h1">
					Service with ID {serviceId} was not found.
				</Typography>
			</Paper>
		)
	const rows: GridRowsProp = logs.map((log) => {
		return {
			id: log.id,
			col1: log.id,
			col2: dayjs(log.createdAt).format("YYYY-MM-DD HH:MM:ss.SSS"),
			col3: log.data,
		}
	})
	const columns: GridColDef[] = [
		{ field: "col1", headerName: "ID", width: 150 },
		{ field: "col2", headerName: "Time", width: 150 },
		{ field: "col3", headerName: "Data", width: 150 },
	]
	console.log(rows)

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

			<div style={{ height: 300, width: "100%" }}>
				<DataGrid
					rows={rows}
					columns={columns}
					getCellClassName={() => styles.p}
					getRowClassName={() => styles.p}
					style={{ color: "#ffffff" }}
					classes={{
						rowCount: styles.p,
					}}
				/>
			</div>

			{/* <TableContainer component={Paper}>
				<Table>
					<colgroup>
						<col style={{ width: "6%" }} />
						<col style={{ width: "14%" }} />
						<col />
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell
								size="small"
								align="right"
								className={styles.p}
							>
								ID
							</TableCell>
							<TableCell
								size="small"
								align="left"
								className={styles.p}
							>
								Time
							</TableCell>
							<TableCell align="left" className={styles.p}>
								Data
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{logs.map((log) => (
							<TableRow key={log.id}>
								<TableCell align="right" className={styles.p}>
									{log.id}
								</TableCell>
								<TableCell align="left" className={styles.p}>
									{dayjs(log.createdAt).format(
										"YYYY-MM-DD HH:MM:ss.SSS"
									)}
								</TableCell>
								<TableCell
									align="left"
									className={styles.p}
									sx={{
										fontFamily: "Roboto Mono",
									}}
								>
									{log.data}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer> */}
		</Paper>
	)
}
export default ServiceLogs
