import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class OptionModel extends Model {
  declare id: string;
  declare questionId: string;
  declare text: string;
}

OptionModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    questionId: { type: DataTypes.UUID, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Option", tableName: "options" }
);

export default OptionModel;
