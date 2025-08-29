type PollAccessType = 'OPEN' | 'CLOSED';

export class Poll {
    constructor(
        id: string,
        title: string,
        // description?: string | null,
        createdBy: string, // user id
        accessType: PollAccessType,
        allowInviteEmails: boolean,       
        options: string[], // option texts (for convenience)
        invitedEmails?: string[], // stored on model for quick access
        createdAt?: Date,
        updatedAt?: Date
    ) {}
}