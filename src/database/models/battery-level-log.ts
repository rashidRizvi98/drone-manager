import { Column, DataType, Model, Table } from "sequelize-typescript";
import { IBatteryLevelLog } from "../../models/battery-level-log";
import { Optional } from "sequelize";

interface IBatteryLevelLogAttributes extends Optional<IBatteryLevelLog,'id'> {}

@Table({
    tableName: "battery-level-logs"
})
export class BatteryLevelLog extends Model<IBatteryLevelLog,IBatteryLevelLogAttributes>{

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true
    })    
    id!: string;

    @Column({
        primaryKey: true,
        type: DataType.STRING,
        allowNull: false,
    })
    serialNumber!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    })
    batteryPercentage!: number;

}