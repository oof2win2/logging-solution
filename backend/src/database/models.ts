import {
	Model,
	DataType,
	Table,
	Column,
	HasMany,
	ForeignKey,
	BelongsTo,
	Unique,
	Length,
} from "sequelize-typescript"

@Table({
	tableName: "services",
})
export class Service extends Model {
	@Column(DataType.STRING)
	name!: string

	@HasMany(() => Log)
	logs!: Log[]
}

@Table({
	tableName: "logs",
})
export class Log extends Model {
	@Column(
		DataType.TEXT({
			length: "long",
		})
	)
	data!: string

	@ForeignKey(() => Service)
	serviceId!: number

	@BelongsTo(() => Service)
	service!: Service

	@Column({
		type: DataType.ENUM("debug", "info", "warn", "error"),
		defaultValue: "info",
	})
	logType!: "debug" | "info" | "warn" | "error"
}
