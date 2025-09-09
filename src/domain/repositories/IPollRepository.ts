import { Poll, Question, Option, Vote, Invitation } from '../entities';

export interface IPollRepository {
  // Poll operations
  createPoll(poll: Omit<Poll, 'id' | 'createdAt' | 'updatedAt'>): Promise<Poll>;
  getPollById(id: string): Promise<Poll | null>;
  getPollsByUser(userId: string): Promise<Poll[]>;
  updatePoll(id: string, updates: Partial<Poll>): Promise<Poll | null>;
  
  // Question operations
  createQuestion(question: Omit<Question, 'id'>): Promise<Question>;
  getQuestionsByPoll(pollId: string): Promise<Question[]>;
  
  // Option operations
  createOption(option: Omit<Option, 'id'>): Promise<Option>;
  getOptionsByQuestion(questionId: string): Promise<Option[]>;
  getOptionsByPoll(pollId: string): Promise<Option[]>;
  
  // Vote operations
  createVote(vote: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote>;
  getVotesByPoll(pollId: string): Promise<Vote[]>;
  getVotesByQuestion(questionId: string): Promise<Vote[]>;
  getUserVotes(pollId: string, userId: string): Promise<Vote[]>;
  
  // Invitation operations
  createInvitation(invitation: Omit<Invitation, 'id' | 'createdAt'>): Promise<Invitation>;
  getInvitationByToken(token: string): Promise<Invitation | null>;
  getInvitationsByPoll(pollId: string): Promise<Invitation[]>;
  markInvitationAsUsed(token: string): Promise<void>;
  checkEmailInvited(pollId: string, email: string): Promise<boolean>;
}