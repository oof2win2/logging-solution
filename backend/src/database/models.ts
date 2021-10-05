import {
	Model,
	DataType,
	Table,
	Column,
	HasMany,
	ForeignKey,
	BelongsTo,
	Unique,
  } from "sequelize-typescript";


@Table({
	tableName: "services"
})
export class Service extends Model {
	@Column(DataType.STRING)
	name!: string

	@HasMany(() => Log)
	logs!: Log[]
}

@Table({
	tableName: "logs"
})
export class Log extends Model {
	@Column
	data!: string

	@ForeignKey(() => Service)
	serviceId!: number

	@BelongsTo(() => Service)
	service!: Service
}