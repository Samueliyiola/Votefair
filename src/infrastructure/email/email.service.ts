// // src/infrastructure/email/EmailService.ts
// import nodemailer from "nodemailer";
// import { env }from "../../shared";


// export class EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: env.EMAIL_HOST, 
//       port: Number(env.EMAIL_PORT), 
//       auth: {
//         user: env.EMAIL_USER,
//         pass: env.EMAIL_PASS,
//       },
//     });
//   }

//   // Send a single email to multiple recipients
//   async sendBatchInvitations(emails: string[], pollId: string) {
//     const inviteLink = `${env.APP_URL}/polls/${pollId}/join`;

//     const mailOptions: nodemailer.SendMailOptions = {
//       from: `"Poll App" <${env.EMAIL_FROM}>`,
//       bcc: emails, // so other people cant be seen in the individual mails
//       subject: "You are invited to participate in a poll",
//       text: `Hello, you have been invited to join the poll. Click here: ${inviteLink}`,
//       html: `<p>Hello,</p>
//              <p>You have been invited to join the poll. 
//              <a href="${inviteLink}">Click here</a> to participate.</p>`,
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log("Batch emails sent:", info.messageId);
//     } catch (error) {
//       console.error("Error sending batch emails:", error);
//       throw error;
//     }
//   }
// }




// src/infrastructure/email/EmailService.ts
import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;
  private chunkSize: number;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT || 2525),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    this.chunkSize = Number(process.env.MAIL_CHUNK_SIZE || 100);
  }

  // send invites using BCC and chunking
  async sendInvitesChunked(emails: string[], pollTitle: string, pollId: string) {
    const inviteLink = `${process.env.APP_URL}/polls/${pollId}/join`;

    for (let i = 0; i < emails.length; i += this.chunkSize) {
      const chunk = emails.slice(i, i + this.chunkSize);
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Poll App" <${process.env.EMAIL_FROM || "no-reply@pollapp.dev"}>`,
        to: process.env.EMAIL_FALLBACK || process.env.EMAIL_FROM,
        bcc: chunk,
        subject: `Invite: ${pollTitle}`,
        text: `You are invited to participate in "${pollTitle}". Link: ${inviteLink}`,
        html: `<p>You are invited to participate in "<b>${pollTitle}</b>".</p>
               <p><a href="${inviteLink}">Click to join</a></p>`,
      };

      await this.transporter.sendMail(mailOptions);
    }
  }
}
