import {VoteService} from "../../../application/services/vote/VoteService";
import {CreatePollService} from "../../../application/services/poll/CreatePollService";
import {UserRepositorySequelize} from "../../repositories/UserRepositorySequelize";
import {PollRepositorySequelize} from "../../repositories/PollRepositorySequelize";

const userRepository = new UserRepositorySequelize();
const pollRepository = new PollRepositorySequelize();
const createPollService = new CreatePollService(pollRepository);
const voteService = new VoteService(pollRepository, userRepository);  

export const pollResolvers = {
  Query: {

  },
  Mutation: {
    createPoll: async (_: any, { input }: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return createPollService.execute({ ...input, userId: ctx.user.id });
    }
  }

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
