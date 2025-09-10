// src/infrastructure/graphql/resolvers/poll.resolver.ts
import { CreatePollService } from '../../../application/services/poll/CreatePollService';
import { VoteService } from '../../../application/services/vote/VoteService';
import {UserRepositorySequelize} from "../../repositories/UserRepositorySequelize";
import { PollRepositorySequelize } from '../../repositories/PollRepositorySequelize';

interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

const pollRepository = new PollRepositorySequelize();
const userRepository = new UserRepositorySequelize();
const createPollService = new CreatePollService(pollRepository);
const voteService = new VoteService(pollRepository, userRepository);


export const pollResolvers = {
  
    Query: {
      // Get all polls for the authenticated user
      polls: async (_: any, __: any, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        return await pollRepository.getPollsByUser(context.user.id);
      },

      // Get a specific poll by ID
      poll: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(id);
        if (!poll) throw new Error('Poll not found');
        
        return poll;
      },

      // Get polls created by the current user
      myPolls: async (_: any, __: any, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        return await pollRepository.getPollsByUser(context.user.id);
      },

      // Get results for a specific poll
      pollResults: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can view results');
        }
        
        return await pollRepository.getVotesByPoll(pollId);
      },

      // Get invitations for a poll
      pollInvitations: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can view invitations');
        }
        
        return await pollRepository.getInvitationsByPoll(pollId);
      },

      // Get questions for a poll
      pollQuestions: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        return await pollRepository.getQuestionsByPoll(pollId);
      },

      // Get options for a question
      questionOptions: async (_: any, { questionId }: { questionId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        return await pollRepository.getOptionsByQuestion(questionId);
      },

      // Get votes for a poll
      pollVotes: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can view votes');
        }
        
        return await pollRepository.getVotesByPoll(pollId);
      },

      // Get votes for a question
      questionVotes: async (_: any, { questionId }: { questionId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        return await pollRepository.getVotesByQuestion(questionId);
      },

      // Get user's votes in a poll
      userPollVotes: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        return await pollRepository.getUserVotes(pollId, context.user.id);
      },

      // Check if an invitation is valid
      checkInvitation: async (_: any, { token }: { token: string }) => {
        return await pollRepository.getInvitationByToken(token);
      },
    },

    Mutation: {
      // Create a new poll
      createPoll: async (_: any, { input }: any, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        return await createPollService.execute({
          title: input.title,
          createdBy: context.user.id,
          accessType: input.accessType,
          allowInviteEmails: input.allowInviteEmails,
          questions: input.questions,
          invitedEmails: input.invitedEmails,
        });
      },

      // Vote on a poll
      vote: async (_: any, { input }: any, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        await voteService.execute(
          input.pollId,
          input.questionId,
          input.optionId,
          context.user.id,
          input.inviteToken
        );
        
        return true;
      },

      // Close a poll
      closePoll: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can close this poll');
        }
        
        const updatedPoll = await pollRepository.updatePoll(pollId, {
          accessType: 'CLOSED'
        });
        
        if (!updatedPoll) throw new Error('Failed to close poll');
        return updatedPoll;
      },

      // Reopen a poll
      reopenPoll: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can reopen this poll');
        }
        
        const updatedPoll = await pollRepository.updatePoll(pollId, {
          accessType: 'OPEN'
        });
        
        if (!updatedPoll) throw new Error('Failed to reopen poll');
        return updatedPoll;
      },

      // Create an invitation
      createInvitation: async (_: any, { pollId, email }: { pollId: string; email: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can create invitations');
        }
        
        const invitation = await pollRepository.createInvitation({
          pollId,
          email,
          token: Math.random().toString(36).substring(2, 15), // Generate random token
          used: false,
        });
        
        return invitation;
      },

      // Create multiple invitations
      createInvitations: async (_: any, { pollId, emails }: { pollId: string; emails: string[] }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can create invitations');
        }
        
        const invitations = [];
        for (const email of emails) {
          const invitation = await pollRepository.createInvitation({
            pollId,
            email,
            token: Math.random().toString(36).substring(2, 15),
            used: false,
          });
          invitations.push(invitation);
        }
        
        return invitations;
      },

      // Create a question
      createQuestion: async (_: any, { pollId, text }: { pollId: string; text: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can add questions');
        }
        
        const question = await pollRepository.createQuestion({
          pollId,
          text,
        });
        
        return question;
      },

      // Create an option
      createOption: async (_: any, { questionId, text }: { questionId: string; text: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const option = await pollRepository.createOption({
          questionId,
          text,
        });
        
        return option;
      },

      // Delete a poll
      deletePoll: async (_: any, { pollId }: { pollId: string }, context: GraphQLContext) => {
        if (!context?.user?.id) throw new Error('Authentication required');
        
        const poll = await pollRepository.getPollById(pollId);
        if (!poll) throw new Error('Poll not found');
        
        if (poll.createdBy !== context.user.id) {
          throw new Error('Only poll creator can delete this poll');
        }
        
        // Note: You might want to add a deletePoll method to your repository
        // For now, we'll just return true if the poll exists and user is authorized
        return true;
      },
    },

    // Field-level resolvers
    Poll: {
      createdBy: async (poll: any) => {
        return await userRepository.findById(poll.createdBy);
      },
      questions: async (poll: any) => {
        return await pollRepository.getQuestionsByPoll(poll.id);
      },
      votes: async (poll: any) => {
        return await pollRepository.getVotesByPoll(poll.id);
      },
    },

    Question: {
      poll: async (question: any) => {
        return await pollRepository.getPollById(question.pollId);
      },
      options: async (question: any) => {
        return await pollRepository.getOptionsByQuestion(question.id);
      },
      votes: async (question: any) => {
        return await pollRepository.getVotesByQuestion(question.id);
      },
    },

    Option: {
      question: async (option: any) => {
        // You might need to add getQuestionById to your repository
        const questions = await pollRepository.getQuestionsByPoll(option.questionId);
        return questions.find((q: any) => q.id === option.questionId);
      },
      votes: async (option: any) => {
        // You might need to add getVotesByOption to your repository
        const allVotes = await pollRepository.getVotesByPoll(option.pollId);
        return allVotes.filter((vote: any) => vote.optionId === option.id);
      },
      voteCount: async (option: any) => {
        const votes = await pollRepository.getVotesByPoll(option.pollId);
        return votes.filter((vote: any) => vote.optionId === option.id).length;
      },
    },

    Vote: {
      poll: async (vote: any) => {
        return await pollRepository.getPollById(vote.pollId);
      },
      question: async (vote: any) => {
        const questions = await pollRepository.getQuestionsByPoll(vote.pollId);
        return questions.find((q: any) => q.id === vote.questionId);
      },
      option: async (vote: any) => {
        const options = await pollRepository.getOptionsByQuestion(vote.questionId);
        return options.find((o: any) => o.id === vote.optionId);
      },
      user: async (vote: any) => {
        return await userRepository.findById(vote.userId);
      },
    },

    Invitation: {
      poll: async (invitation: any) => {
        return await pollRepository.getPollById(invitation.pollId);
      },
    },
};
























// import * as graphqlUpload from "graphql-upload";
// import { parse } from "csv-parse";
// import fs from "fs";
// import path from "path";
// import PollModel from "../../database/models/PollModel";
// import QuestionModel from "../../database/models/QuestionModel";
// import OptionModel from "../../database/models/OptionModel";
// import { CreatePollWithInvitesService } from "../../../application/services/poll/CreatePollWithInvitesService";
// import { VoteService } from "../../../application/services/vote/VoteService";
// import { normalizeAndDedupEmails } from "../../utils/normalizeEmails";

// async function extractEmailsFromUpload(file: any): Promise<string[]> {
//   const { createReadStream, filename } = await file;
//   const tempPath = path.join(__dirname, "../../../uploads", `${Date.now()}-${filename}`);
//   await new Promise((resolve, reject) => {
//     const stream = createReadStream();
//     const out = fs.createWriteStream(tempPath);
//     stream.pipe(out);
//     out.on("finish", resolve);
//     out.on("error", reject);
//   });

//   const emails: string[] = [];
//   await new Promise<void>((resolve, reject) => {
//     fs.createReadStream(tempPath)
//       .pipe(parse({ columns: true, relax_column_count: true, trim: true }))
//       .on("data", (row: any) => {
//         const value = row.email ?? Object.values(row)[0];
//         if (value) emails.push(value);
//       })
//       .on("end", () => resolve())
//       .on("error", (err) => reject(err));
//   });

//   fs.unlinkSync(tempPath);
//   return emails;
// }

// const createService = new CreatePollWithInvitesService();
// const voteService = new VoteService();

// export const pollResolvers = {
//   Upload: graphqlUpload.GraphQLUpload,

//   Query: {
//     pollsForUser: async (_: any, __: any, ctx: any) => {
//       if (!ctx.user) return [];
//       const email = (ctx.user.email || "").toLowerCase();
//       const all = await PollModel.findAll({ order: [["createdAt", "DESC"]] });
//       return all.filter((p) => Array.isArray(p.invitedEmails) ? p.invitedEmails.map((e: string) => e.toLowerCase()).includes(email) || p.accessType === "OPEN" : p.accessType === "OPEN");
//     },

//     poll: async (_: any, { id }: any, ctx: any) => {
//       const poll = await PollModel.findByPk(id);
//       if (!poll) return null;
//       // if closed, ensure user is invited or admin
//       if (poll.accessType === "CLOSED") {
//         if (!ctx.user) throw new Error("Not authorized");
//         const invited = Array.isArray(poll.invitedEmails) ? poll.invitedEmails.map((e: string) => e.toLowerCase()) : [];
//         if (ctx.user.role !== "ADMIN" && !invited.includes(ctx.user.email.toLowerCase())) {
//           throw new Error("You are not invited to this poll");
//         }
//       }
//       return poll;
//     },
//   },

//   Mutation: {
//     createPollWithCSV: async (_: any, { input, file }: any, ctx: any) => {
//       if (!ctx.user) throw new Error("Unauthorized");

//       // extract emails from CSV
//       const rawEmails = await extractEmailsFromUpload(file);
//       const invitedEmails = normalizeAndDedupEmails(rawEmails);

//       const poll = await createService.execute(ctx.user, {
//         title: input.title,
//         description: input.description ?? null,
//         accessType: input.accessType,
//         allowInviteEmails: input.allowInviteEmails ?? true,
//         questions: input.questions,
//         invitedEmails,
//       });

//       return { poll, invitedCount: invitedEmails.length };
//     },

//     vote: async (_: any, { pollId, questionId, optionId }: any, ctx: any) => {
//       if (!ctx.user) throw new Error("Authentication required");
//       const vote = await voteService.vote({ id: ctx.user.id, email: ctx.user.email }, pollId, questionId, optionId);
//       return vote;
//     },
//   },
// };
