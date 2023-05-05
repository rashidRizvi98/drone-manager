import { Model, Column, DataType, Table, PrimaryKey, HasMany, Length } from "sequelize-typescript";
import { DroneModelEnum, DroneStateEnum, IDrone } from "../../models/drone";
import { Optional } from "sequelize";
import { Load } from "./load";
import { enumToArray } from "../../helpers/helper";

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
        allowNull: false,
        validate: {
            len: [1,100]
        }
    })
    serialNumber!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate:{
            isIn: [enumToArray(DroneModelEnum)]
        }
    })
    model!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        validate: {
            min: 200,
            max: 500
        }
    })
    weight!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    })
    battery!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: DroneStateEnum.IDLE,
        validate:{
            isIn: [enumToArray(DroneStateEnum)]
        }
    })
    state!: string;

    @HasMany(() => Load)
    loads!: Load[];

}