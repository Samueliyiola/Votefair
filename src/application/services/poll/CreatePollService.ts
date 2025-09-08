// src/application/services/CreatePollService.ts
import { IPollRepository } from '../../../domain/repositories/IPollRepository';
// import { Poll, Question, Option } from '../../../domain/entities';
import { Poll } from '../../../domain/entities/Poll';
import { Question } from '../../../domain/entities/Question';
import { Option } from '../../../domain/entities/Option';
import { v4 as uuidv4 } from 'uuid';

interface CreatePollInput {
  title: string;
  createdBy: string;
  accessType: 'OPEN' | 'CLOSED';
  allowInviteEmails: boolean;
  questions: Array<{
    text: string;
    options: string[];
  }>;
  invitedEmails?: string[];
}

export class CreatePollService {
  constructor(private pollRepository: IPollRepository) {}

  async execute(input: CreatePollInput): Promise<{
    poll: Poll;
    questions: Question[];
    options: Option[];
    inviteTokens: string[];
  }> {
    // Create the poll
    const poll = await this.pollRepository.createPoll({
      title: input.title,
      createdBy: input.createdBy,
      accessType: input.accessType,
      allowInviteEmails: input.allowInviteEmails,
      options: input.questions.flatMap(q => q.options),
      invitedEmails: input.invitedEmails,
      // invitedEmails: input.invitedEmails ?? [],
    });

    const questions: Question[] = [];
    const options: Option[] = [];
    const inviteTokens: string[] = [];

    // Create questions and options
    for (const questionData of input.questions) {
      const question = await this.pollRepository.createQuestion({
        pollId: poll.id,
        text: questionData.text,
      });
      questions.push(question);

      for (const optionText of questionData.options) {
        const option = await this.pollRepository.createOption({
          questionId: question.id,
          text: optionText,
        });
        options.push(option);
      }
    }

    // Create invitations if needed
    if (input.allowInviteEmails && input.invitedEmails) {
      for (const email of input.invitedEmails) {
        const token = uuidv4();
        await this.pollRepository.createInvitation({
          pollId: poll.id,
          email,
          token,
          used: false,
        });
        inviteTokens.push(token);
      }
    }

    return { poll, questions, options, inviteTokens };
  }
}



