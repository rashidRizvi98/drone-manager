import { Model, Column, DataType, Table, PrimaryKey } from "sequelize-typescript";
import { DroneStateEnum, IDrone } from "../../models/drone";
import { Optional } from "sequelize";
import { IMedication } from "../../models/medication";

interface IMedicationributes extends Optional<IMedication,'id'> {}

@Table({
    timestamps: false,
    tableName: "medications"
})
export class Medication extends Model<IMedication,IMedicationributes>{

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true
    })    
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            is : /^[a-zA-Z0-9-_]+$/
        }
    })
    name!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    weight!: number;

    @Column({
        primaryKey: true,
        type: DataType.STRING,
        allowNull: false,
        validate: {
            is : /^[A-Z0-9_]+$/
        }
    })
    code!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    image!: string;

}