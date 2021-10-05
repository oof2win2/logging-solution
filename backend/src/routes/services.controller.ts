import { FastifyReply, FastifyRequest } from "fastify"
import { Controller, GET } from "fastify-decorators"
import { Type } from "@sinclair/typebox"
import {Service} from "../database/types.js"

@Controller({ route: "/services" })
export default class ServiceController {
	@GET({url: "/"})
	async getAllServices(req: FastifyRequest, res: FastifyReply) {
		const services = await Service.findAll()
		return res.send({services: services})
	}
}