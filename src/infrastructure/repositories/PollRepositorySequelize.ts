import { IPollRepository } from '../../domain/repositories/IPollRepository';
import { Poll, Question, Option, Vote, Invitation } from '../../domain/entities';
import { PollModel } from '../database/models/PollModel';
import { QuestionModel } from '../database/models/QuestionModel';
import { OptionModel } from '../database/models/OptionModel';
import { VoteModel } from '../database/models/VoteModel';
import { InvitationModel } from '../database/models/InvitationModel';
// import { Op } from 'sequelize';

export class PollRepositorySequelize implements IPollRepository {
  //Poll Operations
  async createPoll(pollData: Omit<Poll, 'id' | 'createdAt' | 'updatedAt'>): Promise<Poll> {
    const poll = await PollModel.create(pollData);
    return poll;
  }
  async getPollById(id: string): Promise<Poll | null> {
    return await PollModel.findByPk(id);
  }
  async getPollsByUser(userId: string): Promise<Poll[]> {
    return await PollModel.findAll({
      where: { createdBy: userId },
      order: [['createdAt', 'DESC']],
    });
  }
  async updatePoll(id: string, updates: Partial<Poll>): Promise<Poll | null> {
    const poll = await PollModel.findByPk(id);
    if (!poll) return null;
    await poll.update(updates);
    return poll;
  }

  //Question Operations
  async createQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
    const question = await QuestionModel.create(questionData);
    return question;
  }
  async getQuestionsByPoll(pollId: string): Promise<Question[]> {
    return await QuestionModel.findAll({ where: { pollId } });
  }

  //Option Operations
  async createOption(optionData: Omit<Option, 'id'>): Promise<Option> {
    const option = await OptionModel.create(optionData);
    return option;
  }
  async getOptionsByQuestion(questionId: string): Promise<Option[]> {
    return await OptionModel.findAll({ where: { questionId } });
  }
  async getOptionsByPoll(pollId: string): Promise<Option[]> {
    // This requires a join through questions
    // const questions = await this.getQuestionsByPoll(pollId);
    // const questionIds = questions.map(q => q.id);
    
    // return await OptionModel.findAll({
    //   where: { questionId: questionIds }
    // });
    return await OptionModel.findAll({
      include: [{
        model: QuestionModel,
        where: { pollId },
        attributes: []
      }]
    });
  }

  //Vote Operations
  async createVote(voteData: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote> {
    const vote = await VoteModel.create(voteData);
    return vote;
  }
  async getVotesByPoll(pollId: string): Promise<Vote[]> {
    return await VoteModel.findAll({ where: { pollId } });
  }
  async getVotesByQuestion(questionId: string): Promise<Vote[]> {
    return await VoteModel.findAll({ where: { questionId } });
  }
  async getUserVotes(pollId: string, userId: string): Promise<Vote[]> {
    return await VoteModel.findAll({ where: { pollId, userId } });
  }

  //Invitation Operations
  async createInvitation(invitationData: Omit<Invitation, 'id' | 'createdAt'>): Promise<Invitation> {
    const invitation = await InvitationModel.create(invitationData);
    return invitation;
  }
  async getInvitationByToken(token: string): Promise<Invitation | null> {
    return await InvitationModel.findOne({ where: { token } });
  }
  async getInvitationsByPoll(pollId: string): Promise<Invitation[]> {
    return await InvitationModel.findAll({ where: { pollId } });
  }
  async markInvitationAsUsed(token: string): Promise<void> {
    await InvitationModel.update({ used: true }, { where: { token } });
  }
  async checkEmailInvited(pollId: string, email: string): Promise<boolean> {
    const invitation = await InvitationModel.findOne({ where: { pollId, email, used: false } });
    return !!invitation;
  }
}