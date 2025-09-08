export class Vote{
    constructor(
        public id: string,
        public pollId: string,
        public questionId: string,
        public optionId: string,
        public userId: string,
        public createdAt?: Date
    ){}
}