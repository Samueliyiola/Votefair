type PollAccessType = 'OPEN' | 'CLOSED';

export class Poll {
    constructor(
        public id: string,
        public title: string,
        // public description?: string | null,
        public createdBy: string, // user id
        public accessType: PollAccessType,
        public allowInviteEmails: boolean,
        public options: string[], // option texts (for convenience)
        public invitedEmails?: string[], // stored on model for quick access
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}