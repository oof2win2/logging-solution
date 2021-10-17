import path from "node:path"
const __dirname = path.dirname(new URL(import.meta.url).pathname)
process.chdir(__dirname)
import Fastify, {
	FastifyInstance,
	FastifySchema,
	FastifySchemaCompiler,
	RouteShorthandOptions,
} from "fastify"
import fastifyCorsPlugin from "fastify-cors"
import formBodyPlugin from "fastify-formbody"
import { bootstrap } from "fastify-decorators"
import ENV from "./utils/env.js"
import "./database/database.js"
import { Log, Service } from "./database/models.js"

const fastify: FastifyInstance = Fastify({})

// cors
fastify.register(fastifyCorsPlugin, {
	origin: true, // reflect the request origin
})

// yup stuff
fastify.setValidatorCompiler(({ schema }) => {
	const yupOptions = {
		strict: false,
		abortEarly: false, // return all errors
		stripUnknown: true, // remove additional properties
		recursive: true,
	}
	return function (data) {
		// with option strict = false, yup `validateSync` function returns the coerced value if validation was successful, or throws if validation failed
		try {
			// @ts-ignore-next-line
			const result = schema.validateSync(data, yupOptions)
			return { value: result }
		} catch (e) {
			return { error: e }
		}
	}
})

// form-urlencoded
fastify.register(formBodyPlugin)

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

await Log.sync({ force: true })

function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const logs = new Array(600).fill(0).map((_, i) => {
	let type: "debug" | "info" | "warn" | "error" = "debug"
	switch (randomIntFromInterval(1, 4)) {
		case 1:
			type = "debug"
			break
		case 2:
			type = "info"
			break
		case 3:
			type = "warn"
			break
		case 4:
			type = "error"
			break
	}
	return {
		data: `Log #${i}`,
		serviceId: randomIntFromInterval(1, 2),
		logType: type,
	}
})
await Log.bulkCreate(logs)
