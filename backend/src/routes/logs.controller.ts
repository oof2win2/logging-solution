import { FastifyReply, FastifyRequest } from "fastify"
import { Controller, DELETE, GET, POST, PUT } from "fastify-decorators"
import { Type } from "@sinclair/typebox"
import {Log, Service} from "../database/models.js"
import Sequelize from "sequelize"
const {Op} = Sequelize

@Controller({ route: "/logs" })
export default class ServiceController {
	@GET({url: "/:serviceId", options: {
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.Integer()
			})),
			// body: Type.Optional(Type.Object({
			// 	since: Type.Optional(Type.String()),
			// 	to: Type.Optional(Type.String()),
			// }))
		}
	}})
	async getServiceLogs(req: FastifyRequest<{
		Params: {
			serviceId: number
		}
		Body?: {
			since?: string
			to?: string
		}
	}>, res: FastifyReply) {
		const {serviceId} = req.params
		const {since = "", to = ""} = req.body ?? {}
		const sinceDate = new Date(since || 0)
		const toDate = new Date(to || Date.now())

		const logs = await Log.findAll({
			where: {
				serviceId: serviceId,
				createdAt: {
					[Op.gt]: sinceDate,
					[Op.lt]: toDate
				}
			}
		})
		return res.send({logs: logs})
	}

	@GET({url: "/:serviceId/:logId", options: {
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.Integer(),
				logId: Type.Integer()
			})),
		}
	}})
	async getServiceLog(req: FastifyRequest<{
		Params: {
			serviceId: number
			logId: number
		}
	}>, res: FastifyReply) {
		const {serviceId, logId} = req.params

		const log = await Log.findOne({
			where: {
				serviceId: serviceId,
				id: logId
			}
		})
		return res.send({log: log})
	}

	@PUT({url: "/:serviceId", options: {
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.Integer()
			})),
			body: Type.Required(Type.Object({
				data: Type.String()
			}))
		}
	}})
	async createLog(req: FastifyRequest<{
		Params: {
			serviceId: number
		}
		Body: {
			data: string
		}
	}>, res: FastifyReply) {
		const {serviceId} = req.params
		const {data} = req.body

		const service = await Service.findByPk(serviceId)
		if (!service) return res.status(404).send({
			errorCode: 404,
			error: "Service not found",
			message: "Attempted to create a log for a non-existent service"
		})

		const log = await Log.create({
			data: data,
			serviceId: serviceId
		})
		return res.send(log)
	}
}