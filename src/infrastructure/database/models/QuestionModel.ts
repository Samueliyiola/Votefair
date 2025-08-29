import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class QuestionModel extends Model {
  declare id: string;
  declare pollId: string;
  declare text: string;
}

QuestionModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    pollId: { type: DataTypes.UUID, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Question", tableName: "questions" }
);

export default QuestionModel;
