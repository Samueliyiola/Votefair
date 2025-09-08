export class Invitation {
    constructor(
        public id: string,
        public pollId: string,
        public email: string,
        public token?: string,
        public used?: boolean,
        // public createdAt?: Date
    ) {}
}
