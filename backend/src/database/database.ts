import {
	Sequelize,
} from "sequelize-typescript";
import {Service, Log} from "./types.js";
import ENV from "../utils/env.js";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: ENV.DATABASE_URI,
	logging: () => {},
});
sequelize.addModels([Log, Service])
await sequelize.sync()
export default sequelize