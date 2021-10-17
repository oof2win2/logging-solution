import React, { useEffect, useState } from "react"
import { Paper, Typography, Skeleton } from "@mui/material"
import { Service, Log } from "../../types"
import dayjs from "dayjs"
import ENV from "../../utils/env"
import { useStyles } from "../../utils/Customization"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

interface ServiceLogsProps {
	service: Service
}

const ServiceLogs: React.FC<ServiceLogsProps> = ({ service }) => {
	const [logs, setLogs] = useState<Log[]>([])
	const [fetchingLogs, setFetchingLogs] = useState(false)
	const [tablePage, setTablePage] = useState(0)
	const [maxTablePage, setMaxTablePage] = useState(2)
	const [rowsPerPage, setRowsPerPage] = useState(100)
	const styles = useStyles()

	const fetchLogs = (): void => {
		if (fetchingLogs) return

		const run = async () => {
			setFetchingLogs(true)
			const params: {
				limit: number
				logsBeforeId?: number
			} = {
				limit: logs.length ? 100 : 200,
			}

			if (logs.length) {
				let min = Infinity
				logs.forEach((log) => {
					if (log.id < min) min = log.id
				})
				params.logsBeforeId = min
			}

			const fetchedLogs = await fetch(
				`${ENV.REACT_APP_API_URL}/logs/${service.id}`,
				{
					method: "POST",
					body: JSON.stringify(params),
					headers: {
						"content-type": "application/json",
					},
				}
			).then((r) => r.json())
			if (fetchedLogs.logs) setLogs([...logs, ...fetchedLogs.logs])

			setFetchingLogs(false)
			return
		}
		run()
	}

	useEffect(() => {
		if (!fetchingLogs) fetchLogs()
	}, [])

	const handleTablePageChange = (tablePage: number) => {
		setTablePage(tablePage)
		if (tablePage + 1 >= maxTablePage) fetchLogs()
	}
	const handlePageSizeChange = (newSize: number) => {
		setMaxTablePage(newSize)
		setMaxTablePage(Math.ceil(logs.length / newSize))
	}

	const IDSet = new Set()
	const rows: GridRowsProp = logs.map((log) => {
		IDSet.add(log.id)
		return {
			id: log.id,
			col1: log.id,
			col2: dayjs(log.createdAt).format("YYYY-MM-DD HH:MM:ss.SSS"),
			col3: log.data,
		}
	})

	const columns: GridColDef[] = [
		{
			field: "col1",
			headerName: "ID",
			width: 144,
			cellClassName: styles.p,
		},
		{
			field: "col2",
			headerName: "Time",
			width: 190,
			cellClassName: styles.p,
		},
		{
			field: "col3",
			headerName: "Data",
			width: window.outerWidth - 198 - 48,
			cellClassName: styles.pmono,
		},
	]

	return (
		<Paper elevation={1}>
			<Typography variant="h1">
				{service.name} ({service.id})
			</Typography>

			<div style={{ height: 384, width: "100%" }}>
				<DataGrid
					rows={rows}
					columns={columns}
					getRowClassName={() => styles.p}
					style={{ color: "#ffffff" }}
					classes={{
						rowCount: styles.p,
					}}
					onPageChange={handleTablePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			</div>
		</Paper>
	)
}
export default ServiceLogs
