import { Model, Column, DataType, Table, PrimaryKey, HasMany } from "sequelize-typescript";
import { DroneStateEnum, IDrone } from "../../models/drone";
import { Optional } from "sequelize";
import { Load } from "./load";

interface IDroneAttributes extends Optional<IDrone,'id'> {}

@Table({
    timestamps: false,
    tableName: "drones"
})
export class Drone extends Model<IDrone,IDroneAttributes>{

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })    
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    serialNumber!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    model!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    weight!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    battery!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: DroneStateEnum.IDLE
    })
    state!: string;

    @HasMany(() => Load)
    loads!: Load[];

}