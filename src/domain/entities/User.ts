export class User {
  constructor(public id: string, public name: string, public email: string) {}

  // example domain rule
  changeEmail(newEmail: string) {
    if (!newEmail.includes('@')) throw new Error('Invalid email');
    this.email = newEmail;
  }
}
