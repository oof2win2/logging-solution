import path from "node:path"
const __dirname = path.dirname(new URL(import.meta.url).pathname)
process.chdir(__dirname)
import Fastify, { FastifyInstance } from "fastify"
import fastifyCorsPlugin from "fastify-cors"
import { bootstrap } from "fastify-decorators"
import ENV from "./utils/env.js"
import "./database/database.js"


const fastify: FastifyInstance = Fastify({})

// cors
fastify.register(fastifyCorsPlugin, {
	origin: true // reflect the request origin
})

fastify.register(bootstrap, {
	directory: path.resolve(__dirname, "routes"),
})


const start = async () => {
	try {
		await fastify.listen(ENV.API_PORT)

		const address = fastify.server.address()
		const port = typeof address === "string" ? address : address?.port
		console.log(`Server listening on :${port}`)

	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
start()