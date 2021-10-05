import dotenv from "dotenv"
import { cleanEnv, str, port, url } from "envalid"
dotenv.config({
	path: "./.env"
})
const ENV = cleanEnv(process.env, {
	API_PORT: port({ default: 3000 }),
	DATABASE_URI: str({default: "./database.sqlite", desc: "Where the database file is located"})
})
export default ENV