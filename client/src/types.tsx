export interface Service {
	id: number
	name: string
	logs: Log[]
}
export interface Log {
	id: number
	data: string
	serviceId: number
	createdAt: string
}
