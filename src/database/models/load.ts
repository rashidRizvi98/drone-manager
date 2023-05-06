import { Model, Column, DataType, Table, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { DroneStateEnum, IDrone } from "../../models/drone";
import { Optional } from "sequelize";
import { ILoad } from "../../models/load";
import { Drone } from "./drone";
import { Medication } from "./medication";

interface ILoadAttributes extends Optional<ILoad,'id'> {}

@Table({
    timestamps: false,
    tableName: "loads"
})
export class Load extends Model<ILoad,ILoadAttributes>{

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })    
    id!: string;

    @ForeignKey(() => Drone)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    serialNumber!: string;

    @ForeignKey(() => Medication)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    count!: number;

}