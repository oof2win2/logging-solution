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
	
	@DELETE({url: "/", options: {
		schema: {
			body: Type.Required(Type.Object({
				id: Type.Number()
			}))
		}
	}})
	async removeService(req: FastifyRequest<{
		Body: {
			id: number
		}
	}>, res: FastifyReply) {
		const {id} = req.body

		const service = await Service.destroy({
			where: {
				id: id
			}
		})
		return res.send({service: service})
	}
}