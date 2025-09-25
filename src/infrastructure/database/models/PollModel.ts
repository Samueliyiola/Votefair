import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class PollModel extends Model {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare createdBy: string;
  declare accessType: "OPEN" | "CLOSED";
  declare allowInviteEmails: boolean;
  declare invitedEmails: string[]; // JSON
  declare options: string[]; // JSON of option texts
  declare createdAt: Date;
  declare updatedAt: Date;
}

PollModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: false },
    accessType: { type: DataTypes.ENUM("OPEN", "CLOSED"), allowNull: false, defaultValue: "OPEN" },
    allowInviteEmails: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    invitedEmails: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    options: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "Poll", tableName: "polls" }
);

export default PollModel;
