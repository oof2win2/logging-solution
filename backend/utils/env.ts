import { Envalid, Dotenv } from "../deps.ts";
const { cleanEnv, port } = Envalid;

const env = Dotenv.config({
	path: "./.env"
})
if (env.error) throw env.error

const ENV = cleanEnv(env.parsed, {
  API_PORT: port({ desc: "App port", default: 8080 }),
});
export default ENV;
