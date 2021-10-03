import { Servest } from "./deps.ts";
import ENV from "./utils/env.ts";

const { createApp } = Servest;

const app = createApp()
// app.use(cors({
// 	origin: "*",
// }))

// automatic loading of all routes in ./routes
for await (const entry of Deno.readDir("./routes")) {
	if (entry.name.endsWith(".controller.ts")) {
		const data = await import(`./routes/${entry.name}`)
		app.route(`/${entry.name.split(".")[0]}`, data.default())
	}
}

// export default app
// import "./routes/logs.ts"

app.listen({port: ENV.API_PORT})