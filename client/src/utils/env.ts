import { url, cleanEnv } from "envalid"

console.log(process.env, process.env.REACT_APP_API_URL)
const ENV = cleanEnv(process.env, {
	REACT_APP_API_URL: url({ desc: "API URL" }),
})

export default ENV
