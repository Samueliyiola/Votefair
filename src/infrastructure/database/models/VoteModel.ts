import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class VoteModel extends Model {
  declare id: string;
  declare pollId: string;
  declare questionId: string;
  declare optionId: string;
  declare userId: string;
  declare createdAt: Date;
}

VoteModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    pollId: { type: DataTypes.UUID, allowNull: false },
    questionId: { type: DataTypes.UUID, allowNull: false },
    optionId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: "Vote", tableName: "votes", timestamps: true, updatedAt: false }
);

export default VoteModel;
