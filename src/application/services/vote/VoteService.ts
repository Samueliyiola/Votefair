// src/application/services/VoteService.ts
import VoteModel from "../../../infrastructure/database/models/VoteModel";
import PollModel from "../../../infrastructure/database/models/PollModel";
import InvitationModel from "../../../infrastructure/database/models/InvitationModel";
import OptionModel from "../../../infrastructure/database/models/OptionModel";
import { Op } from "sequelize";

export class VoteService {
  async vote(user: { id: string; email: string }, pollId: string, questionId: string, optionId: string) {
    if (!user) throw new Error("Authentication required");

    const poll = await PollModel.findByPk(pollId);
    if (!poll) throw new Error("Poll not found");

    // if poll closed (status management can be added), here: accessType check done
    if (poll.accessType === "CLOSED") {
      // check if user email is invited
      const invitedEmails = Array.isArray(poll.invitedEmails) ? poll.invitedEmails.map((e: string) => e.toLowerCase()) : [];
      if (!invitedEmails.includes(user.email.toLowerCase())) {
        // fallback: also check invitations table (in case user signed up after invites)
        const inv = await InvitationModel.findOne({ where: { pollId, email: user.email } });
        if (!inv) throw new Error("You are not invited to this poll");
      }
    }

    // ensure option exists and belongs to question
    const option = await OptionModel.findByPk(optionId);
    if (!option || option.questionId !== questionId) throw new Error("Invalid option");

    // prevent duplicate vote by same user for same question
    const existing = await VoteModel.findOne({
      where: { questionId, userId: user.id },
    });
    if (existing) throw new Error("You have already voted on this question");

    const vote = await VoteModel.create({
      id: cryptoRandomId(),
      pollId,
      questionId,
      optionId,
      userId: user.id,
    });

    return vote;
  }
}

function cryptoRandomId() {
  return require("crypto").randomUUID();
}
