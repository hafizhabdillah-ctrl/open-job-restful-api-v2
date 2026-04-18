import nodemailer from 'nodemailer';

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, applicantEmail, applicantName, applicationDate) {
    const message = {
      from: 'OpenJob Notification',
      to: targetEmail,
      subject: 'Notifikasi Lamaran Pekerjaan Baru',
      html: `
        <p>Ada pelamar baru untuk pekerjaan Anda:</p>
        <ul>
          <li><strong>Email Pelamar:</strong> ${applicantEmail}</li>
          <li><strong>Nama Pelamar:</strong> ${applicantName}</li>
          <li><strong>Tanggal Lamaran:</strong> ${new Date(applicationDate).toLocaleDateString('id-ID')}</li>
        </ul>
      `,
    };

    return this._transporter.sendMail(message);
  }
}

export default MailSender;
