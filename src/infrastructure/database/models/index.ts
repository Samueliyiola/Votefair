// models/index.ts
import PollModel from "./PollModel";
import QuestionModel from "./QuestionModel";
import OptionModel from "./OptionModel";
import VoteModel from "./VoteModel";
import InvitationModel from "./InvitationModel";
import UserModel from "./UserModel";
import { setupAssociations } from "../associations";
import sequelize from "../sequelize";

// Initialize associations
setupAssociations();

export {
  sequelize,
  PollModel,
  QuestionModel,
  OptionModel,
  VoteModel,
  InvitationModel,
  UserModel,
};
