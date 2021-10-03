import {Servest} from "../deps.ts"
const {createRouter} = Servest

function LogRouter() {
	const LogRouter = createRouter()
	LogRouter.get("/", async (req) => {
		console.log("get")
		await req.respond({
			status: 200,
			headers: new Headers({
				"content-type": "application/json"
			}),
			body: JSON.stringify({
				message: "Hello there!"
			})
		})
	})
	return LogRouter
}
export default LogRouter