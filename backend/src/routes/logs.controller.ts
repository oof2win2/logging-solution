import { FastifyReply, FastifyRequest } from "fastify"
import { Controller, DELETE, GET, POST, PUT } from "fastify-decorators"
import * as yup from "yup"
import { Log, Service } from "../database/models.js"
import Sequelize from "sequelize"
const { Op } = Sequelize

@Controller({ route: "/logs" })
export default class ServiceController {
	@POST({
		url: "/:serviceId",
		options: {
			schema: {
				params: yup
					.object({
						serviceId: yup.number().required(),
					})
					.required(),
				body: yup
					.object({
						since: yup.date().min("0").optional(),
						to: yup.date().min("0").optional(),
						limit: yup
							.number()
							.default(100)
							.positive()
							.integer()
							.transform((input) => Math.min(input, 1000)),
						logsBeforeId: yup.number().positive().optional(),
					})
					.nullable(),
			},
		},
	})
	async getServiceLogs(
		req: FastifyRequest<{
			Params: {
				serviceId: number
			}
			Body?: {
				since?: string
				to?: string
				limit: number
				logsBeforeId?: number
			}
		}>,
		res: FastifyReply
	) {
		const { serviceId } = req.params
		const { since = "", to = "", limit, logsBeforeId } = req.body ?? {}
		const sinceDate = new Date(since || 0)
		const toDate = new Date(to || Date.now())
		const logs = await Log.findAll({
			where: {
				serviceId: serviceId,
				createdAt: {
					[Op.gt]: sinceDate,
					[Op.lt]: toDate,
				},
				...(logsBeforeId
					? {
							id: {
								[Op.lt]: logsBeforeId,
							},
					  }
					: {}),
			},
			limit: limit,
			order: [["id", "DESC"]],
		})
		return res.send({ logs: logs })
	}

	@GET({
		url: "/:serviceId/:logId",
		options: {
			schema: {
				params: yup.object({
					serviceId: yup.number().integer(),
					logId: yup.number().integer(),
				}),
			},
		},
	})
	async getServiceLog(
		req: FastifyRequest<{
			Params: {
				serviceId: number
				logId: number
			}
		}>,
		res: FastifyReply
	) {
		const { serviceId, logId } = req.params

		const log = await Log.findOne({
			where: {
				serviceId: serviceId,
				id: logId,
			},
		})
		return res.send({ log: log })
	}

	@PUT({
		url: "/:serviceId",
		options: {
			schema: {
				params: yup
					.object({
						serviceId: yup.number().integer(),
					})
					.required(),
				body: yup
					.object({
						data: yup.string(),
					})
					.required(),
			},
		},
	})
	async createLog(
		req: FastifyRequest<{
			Params: {
				serviceId: number
			}
			Body: {
				data: string
			}
		}>,
		res: FastifyReply
	) {
		const { serviceId } = req.params
		const { data } = req.body

		const service = await Service.findByPk(serviceId)
		if (!service)
			return res.status(404).send({
				errorCode: 404,
				error: "Service not found",
				message: "Attempted to create a log for a non-existent service",
			})

		const log = await Log.create({
			data: data,
			serviceId: serviceId,
		})
		return res.send(log)
	}
}
