import { Model, Column, DataType, Table, PrimaryKey, HasMany, Length } from "sequelize-typescript";
import { DroneModelEnum, DroneStateEnum, IDrone } from "../../models/drone";
import { Optional } from "sequelize";
import { Load } from "./load";
import { enumToArray } from "../../helpers/helper";

interface IDroneAttributes extends Optional<IDrone,'id'> {}

@Table({
    tableName: "drones"
})
export class Drone extends Model<IDrone,IDroneAttributes>{

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true
    })    
    id!: string;

    @Column({
        primaryKey: true,
        type: DataType.STRING,
        allowNull: false,
        validate: {
            len: [1,100]
        },
        unique: true
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
    weightLimit!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    })
    batteryPercentage!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: DroneStateEnum.IDLE,
        validate:{
            isIn: [enumToArray(DroneStateEnum)]
        }
    })
    state!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    })
    distanceToDestination!: number;

    @HasMany(() => Load)
    loads!: Load[];

}