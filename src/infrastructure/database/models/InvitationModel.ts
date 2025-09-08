import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

export class InvitationModel extends Model {
  declare id: string;
  declare pollId: string;
  declare email: string;
  // declare token: string | null;
  declare token: string;
  declare used: boolean;
  declare createdAt: Date;
}

InvitationModel.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    pollId: { type: DataTypes.UUID, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "Invitation", tableName: "invitations" }
);

export default InvitationModel;
