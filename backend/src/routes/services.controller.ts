import { FastifyReply, FastifyRequest } from "fastify"
import { Controller, DELETE, GET, POST } from "fastify-decorators"
import { Type } from "@sinclair/typebox"
import {Service} from "../database/models.js"
  

@Controller({ route: "/services" })
export default class ServiceController {
	@GET({url: "/"})
	async getAllServices(req: FastifyRequest, res: FastifyReply) {
		const services = await Service.findAll()
		return res.send({services: services})
	}
	@GET({url: "/:serviceId", options:{
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.Number()
			}))
		}
	}})
	async getService(req: FastifyRequest<{
		Params: {
			serviceId: number
		}
	}>, res: FastifyReply) {
		const service = await Service.findByPk(req.params.serviceId)
		return res.send({service: service})
	}
	
	@POST({url: "/", options: {
		schema: {
			body: Type.Required(Type.Object({
				name: Type.String()
			}))
		}
	}})
	async createService(req: FastifyRequest<{
		Body: {
			name: string
		}
	}>, res: FastifyReply) {
		const {name} = req.body
		
		const service = await Service.create({
			name: name
		})
		return res.send({service: service})
	}
	
	@DELETE({url: "/:serviceId", options: {
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.Number()
			}))
		}
	}})
	async removeService(req: FastifyRequest<{
		Params: {
			serviceId: number
		}
	}>, res: FastifyReply) {
		const {serviceId} = req.params
		const service = await Service.findByPk(serviceId)
		if (!service) return res.send({service: null})
		await Service.destroy({
			where: {
				id: serviceId
			}
		})
		return res.send({service: service})
	}

	@POST({url: "/:serviceId", options: {
		schema: {
			params: Type.Required(Type.Object({
				serviceId: Type.String()
			})),
			body: Type.Object({
				name: Type.Optional(Type.String())
			})
		}
	}})
	async modifyService(req: FastifyRequest<{
		Params: {
			serviceId: string
		}
		Body: {
			name?: string
		}
	}>, res: FastifyReply) {
		const {serviceId} = req.params
		const {name} = req.body
		const service = await Service.update({
			name: name
		}, {
			where: {
				id: serviceId
			}
		})
		if (!service[0]) {
			return res.status(404).send({
				errorCode: 404,
				error: "Service not found",
				message: `Service with the ID ${serviceId} was not found`
			})
		}
		return res.send(service[1][0])
	}

}