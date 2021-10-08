export interface Service {
	id: number
	name: string
	logs: Log[]
}
export interface Log {
	data: string
	serviceId: number
	createdAt: string
}
