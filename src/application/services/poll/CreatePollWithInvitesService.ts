// src/application/services/CreatePollWithInvitesService.ts
import crypto from "crypto";
import PollModel from "../../../infrastructure/database/models/PollModel";
import QuestionModel from "../../../infrastructure/database/models/QuestionModel";
import OptionModel from "../../../infrastructure/database/models/OptionModel";
import InvitationModel from "../../../infrastructure/database/models/InvitationModel";
import { EmailService } from "../../../infrastructure/email/email.service";
import { normalizeAndDedupEmails } from "../../../infrastructure/utils/normalizeEmails";

type QuestionInput = { text: string; options: string[] };

export class CreatePollWithInvitesService {
  private emailService = new EmailService();

  async execute(
    currentUser: { id: string; role: string },
    input: {
      title: string;
      description?: string | null;
      accessType: "OPEN" | "CLOSED";
      allowInviteEmails?: boolean;
      questions: QuestionInput[];
      invitedEmails?: string[];
    }
  ) {
    if (!currentUser) throw new Error("Unauthorized");
    if (currentUser.role !== "ADMIN") throw new Error("Only admins can create polls");

    const { title, description, accessType, allowInviteEmails = true, questions, invitedEmails = [] } = input;

    if (!questions || questions.length === 0) throw new Error("Poll must have at least one question");

    // normalize + dedup invited emails
    const invited = normalizeAndDedupEmails(invitedEmails || []);

    // create poll record
    const poll = await PollModel.create({
      id: crypto.randomUUID(),
      title,
      description: description ?? null,
      createdBy: currentUser.id,
      accessType,
      allowInviteEmails,
      invitedEmails: invited,
      options: [], // optional convenience field
    });

    // create questions & options
    for (const q of questions) {
      const question = await QuestionModel.create({
        id: crypto.randomUUID(),
        pollId: poll.id,
        text: q.text,
      });

      for (const optText of q.options) {
        await OptionModel.create({
          id: crypto.randomUUID(),
          questionId: question.id,
          text: optText,
        });
      }
    }

    // create invites and send emails (if allowed)
    if (invited.length > 0) {
      const invites = invited.map((email) => ({
        id: crypto.randomUUID(),
        pollId: poll.id,
        email,
        token: null,
        used: false,
      }));
      await InvitationModel.bulkCreate(invites);

      if (allowInviteEmails) {
        // send chunked BCC invites
        await this.emailService.sendInvitesChunked(invited, poll.title, poll.id);
      }
    }

    return poll;
  }
}
