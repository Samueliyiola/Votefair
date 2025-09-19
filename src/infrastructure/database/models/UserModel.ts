import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize';

export class UserModel extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  // public isVerified!: boolean;
  public isAdmin!: boolean;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {type: DataTypes.STRING, allowNull: false},
    // isVerified : {type: DataTypes.BOOLEAN, defaultValue: false},
    isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false}
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default UserModel;
