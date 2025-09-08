// src/application/services/VoteService.ts
import { IPollRepository } from '../../../domain/repositories/IPollRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class VoteService {
  constructor(
    private pollRepository: IPollRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    pollId: string,
    questionId: string,
    optionId: string,
    userId: string,
    inviteToken?: string
  ): Promise<void> {
    const poll = await this.pollRepository.getPollById(pollId);
    if (!poll || poll.accessType === 'CLOSED') {
      throw new Error('Poll not found or closed for voting');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if voting requires invitation
    if (poll.allowInviteEmails) {
      let isInvited = false;
      
      if (inviteToken) {
        const invitation = await this.pollRepository.getInvitationByToken(inviteToken);
        isInvited = !!invitation && !invitation.used && invitation.pollId === pollId;
        if (isInvited) {
          await this.pollRepository.markInvitationAsUsed(inviteToken);
        }
      } else {
        isInvited = await this.pollRepository.checkEmailInvited(pollId, user.email);
      }

      if (!isInvited) {
        throw new Error('You are not invited to vote in this poll');
      }
    }

    // Check if user already voted on this question
    const userVotes = await this.pollRepository.getUserVotes(pollId, userId);
    const alreadyVoted = userVotes.some(vote => vote.questionId === questionId);
    
    if (alreadyVoted) {
      throw new Error('You have already voted on this question');
    }

    // Validate that option belongs to question
    const options = await this.pollRepository.getOptionsByQuestion(questionId);
    const validOption = options.some(option => option.id === optionId);
    
    if (!validOption) {
      throw new Error('Invalid option for this question');
    }

    await this.pollRepository.createVote({
      pollId,
      questionId,
      optionId,
      userId,
    });
  }
}







// // src/application/services/VoteService.ts
// import VoteModel from "../../../infrastructure/database/models/VoteModel";
// import PollModel from "../../../infrastructure/database/models/PollModel";
// import InvitationModel from "../../../infrastructure/database/models/InvitationModel";
// import OptionModel from "../../../infrastructure/database/models/OptionModel";
// import { Op } from "sequelize";

// export class VoteService {
//   async vote(user: { id: string; email: string }, pollId: string, questionId: string, optionId: string) {
//     if (!user) throw new Error("Authentication required");

//     const poll = await PollModel.findByPk(pollId);
//     if (!poll) throw new Error("Poll not found");

//     // if poll closed (status management can be added), here: accessType check done
//     if (poll.accessType === "CLOSED") {
//       // check if user email is invited
//       const invitedEmails = Array.isArray(poll.invitedEmails) ? poll.invitedEmails.map((e: string) => e.toLowerCase()) : [];
//       if (!invitedEmails.includes(user.email.toLowerCase())) {
//         // fallback: also check invitations table (in case user signed up after invites)
//         const inv = await InvitationModel.findOne({ where: { pollId, email: user.email } });
//         if (!inv) throw new Error("You are not invited to this poll");
//       }
//     }

//     // ensure option exists and belongs to question
//     const option = await OptionModel.findByPk(optionId);
//     if (!option || option.questionId !== questionId) throw new Error("Invalid option");

//     // prevent duplicate vote by same user for same question
//     const existing = await VoteModel.findOne({
//       where: { questionId, userId: user.id },
//     });
//     if (existing) throw new Error("You have already voted on this question");

//     const vote = await VoteModel.create({
//       id: cryptoRandomId(),
//       pollId,
//       questionId,
//       optionId,
//       userId: user.id,
//     });

//     return vote;
//   }
// }

// function cryptoRandomId() {
//   return require("crypto").randomUUID();
// }
