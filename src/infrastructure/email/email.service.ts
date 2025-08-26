// src/infrastructure/email/EmailService.ts
import nodemailer from "nodemailer";
import{ env }from "../../shared";


export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST, 
      port: Number(env.EMAIL_PORT), 
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  // Send a single email to multiple recipients
  async sendBatchInvitations(emails: string[], pollId: string) {
    const inviteLink = `${process.env.APP_URL}/polls/${pollId}/join`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Poll App" <${process.env.EMAIL_FROM}>`,
      to: emails, // Mailtrap will show them all in the inbox preview
      subject: "You are invited to participate in a poll",
      text: `Hello, you have been invited to join the poll. Click here: ${inviteLink}`,
      html: `<p>Hello,</p>
             <p>You have been invited to join the poll. 
             <a href="${inviteLink}">Click here</a> to participate.</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Batch emails sent:", info.messageId);
    } catch (error) {
      console.error("Error sending batch emails:", error);
      throw error;
    }
  }
}
