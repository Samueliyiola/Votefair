import { PollModel } from './models/PollModel';
import { QuestionModel } from './models/QuestionModel';
import { OptionModel } from './models/OptionModel';
import { VoteModel } from './models/VoteModel';
import { InvitationModel } from './models/InvitationModel';
import { UserModel } from './models/UserModel'; 

export const setupAssociations = () => {
  // Poll ↔ Question (One-to-Many)
  PollModel.hasMany(QuestionModel, { 
    foreignKey: 'pollId', 
    as: 'questions',
    onDelete: 'CASCADE' // Delete questions when poll is deleted
  });
  QuestionModel.belongsTo(PollModel, { 
    foreignKey: 'pollId', 
    as: 'poll' 
  });

  // Question ↔ Option (One-to-Many)
  QuestionModel.hasMany(OptionModel, { 
    foreignKey: 'questionId', 
    as: 'options',
    onDelete: 'CASCADE' // Delete options when question is deleted
  });
  OptionModel.belongsTo(QuestionModel, { 
    foreignKey: 'questionId', 
    as: 'question' 
  });

  // Poll ↔ Vote (One-to-Many)
  PollModel.hasMany(VoteModel, { 
    foreignKey: 'pollId', 
    as: 'votes',
    onDelete: 'CASCADE' 
  });
  VoteModel.belongsTo(PollModel, { 
    foreignKey: 'pollId', 
    as: 'poll' 
  });

  // Question ↔ Vote (One-to-Many)
  QuestionModel.hasMany(VoteModel, { 
    foreignKey: 'questionId', 
    as: 'votes',
    onDelete: 'CASCADE' 
  });
  VoteModel.belongsTo(QuestionModel, { 
    foreignKey: 'questionId', 
    as: 'question' 
  });

  // Option ↔ Vote (One-to-Many)
  OptionModel.hasMany(VoteModel, { 
    foreignKey: 'optionId', 
    as: 'votes',
    onDelete: 'CASCADE' 
  });
  VoteModel.belongsTo(OptionModel, { 
    foreignKey: 'optionId', 
    as: 'option' 
  });

  // Poll ↔ Invitation (One-to-Many)
  PollModel.hasMany(InvitationModel, { 
    foreignKey: 'pollId', 
    as: 'invitations',
    onDelete: 'CASCADE' 
  });
  InvitationModel.belongsTo(PollModel, { 
    foreignKey: 'pollId', 
    as: 'poll' 
  });

  // User ↔ Poll (One-to-Many)
  UserModel.hasMany(PollModel, { 
    foreignKey: 'createdBy', 
    as: 'polls',
    onDelete: 'CASCADE' 
  });
  PollModel.belongsTo(UserModel, { 
    foreignKey: 'createdBy', 
    as: 'creator' 
  });

  // User ↔ Vote (One-to-Many)
  UserModel.hasMany(VoteModel, { 
    foreignKey: 'userId', 
    as: 'votes',
    onDelete: 'CASCADE' 
  });
  VoteModel.belongsTo(UserModel, { 
    foreignKey: 'userId', 
    as: 'user' 
  });

  console.log('Database associations setup complete');
};