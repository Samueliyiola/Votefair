export class User {
  constructor(
    public id: string, 
    public firstName: string, 
    public lastName: string,
    public email: string,
    public password: string,
    public isVerified: boolean = false //default to false
  ) {}

  // example domain rule
  // changeEmail(newEmail: string) {
  //   if (!newEmail.includes('@')) throw new Error('Invalid email');
  //   this.email = newEmail;
  // }
}
