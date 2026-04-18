import { Pool } from 'pg';

class Listener {
  constructor(mailSender) {
    this._mailSender = mailSender;
    this._pool = new Pool();

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { applicationId, userId, jobId } = JSON.parse(message.content.toString());

      const applicantQuery = {
        text: 'SELECT email, name FROM users WHERE id = $1',
        values: [userId],
      };
      const applicantResult = await this._pool.query(applicantQuery);
      if (applicantResult.rowCount === 0) {
        console.error('Applicant not found');
        return;
      }
      const { email: applicantEmail, name: applicantName } = applicantResult.rows[0];

      const applicationQuery = {
        text: 'SELECT created_at FROM applications WHERE id = $1',
        values: [applicationId],
      };
      const applicationResult = await this._pool.query(applicationQuery);
      if (applicationResult.rowCount === 0) {
        console.error('Application not found');
        return;
      }
      const applicationDate = applicationResult.rows[0].created_at;

      const jobOwnerQuery = {
        text: 'SELECT u.email FROM jobs j JOIN users u ON j.user_id = u.id WHERE j.id = $1',
        values: [jobId],
      };
      const jobOwnerResult = await this._pool.query(jobOwnerQuery);
      if (jobOwnerResult.rowCount === 0) {
        console.error('Job owner not found');
        return;
      }
      const jobOwnerEmail = jobOwnerResult.rows[0].email;

      await this._mailSender.sendEmail(jobOwnerEmail, applicantEmail, applicantName, applicationDate);
      console.log(`Email sent to ${jobOwnerEmail} for application ${applicationId}`);

    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
}

export default Listener;
