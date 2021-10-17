import React, { useEffect, useState } from "react"
import { Paper, CircularProgress, Typography } from "@mui/material"
import { Service } from "../../types"
import ENV from "../../utils/env"
import ServiceLogs from "../../components/ServiceLogs/ServiceLogs"

const Services: React.FC = () => {
	const [services, setServices] = useState<Service[]>([])
	const [fetchingServices, setFetchingServices] = useState(true)

	useEffect(() => {
		const fetchServices = async () => {
			setFetchingServices(true)
			const fetchedServices = await fetch(
				`${ENV.REACT_APP_API_URL}/services/`
			).then((r) => r.json())
			if (fetchedServices.services) setServices(fetchedServices.services)
			setFetchingServices(false)
		}
		fetchServices()
	}, [])

	return (
		<Paper elevation={1}>
			{fetchingServices && <CircularProgress />}
			{!fetchingServices && services.length == 0 && (
				<Typography variant="h1">No services found</Typography>
			)}
			{services.length &&
				services.map((service) => (
					<ServiceLogs service={service} key={service.id} />
				))}
		</Paper>
	)
}
export default Services
