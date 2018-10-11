const API_KEY = process.env.MAILGUN_API_KEY || 'apiKey';
const DOMAIN = process.env.MAILGUN_DOMAIN || 'dav.network';

import * as mailgunService from 'mailgun-js';

const mailgun = mailgunService({ apiKey: API_KEY, domain: DOMAIN });

export default async function sendEmail(from: string, to: string, subject: string, html: string) {
  const emailData = {
    from,
    to,
    subject,
    html,
  };
  mailgun.messages().send(emailData, (error, response) => {
    if (error) {
      throw new Error(error.message);
    }
    return response.message;
  });
}
