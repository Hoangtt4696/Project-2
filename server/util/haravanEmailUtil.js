import path from 'path';
import swig from 'swig';

import log from './loggerUtil';
import { callApi } from './apiCaller';
import envConfig from '../../config/config';

export const fixYahooEmail = email => {
  if (!email) {
    return email;
  }

  if (email.indexOf('+') !== -1 && email.indexOf('yahoo') !== -1) {
    const tmp = email.split('@');
    const tmp2 = tmp[0].split('+');

    return `${tmp2[0]}@${tmp[1]}`;
  }

  return email;
};

export const sendMail = async ({
  fromName = '',
  fromEmail = '',
  toName = '',
  toEmail = '',
  subject = '',
  body = '',
}) => {
  try {
    fromEmail = fixYahooEmail(fromEmail);
    toEmail = fixYahooEmail(toEmail);

    const postData = {
      IsHtmlBody: true,
      MailType: 0,
      From: {
        Address: fromEmail,
        DisplayName: fromName,
      },
      To: [
        {
          Address: toEmail,
          DisplayName: toName,
        },
      ],
      CC: null,
      BCC: null,
      Subject: subject,
      Body: body,
      AttachFileUrls: null,
      Action: 100,
      EventTypes: [],
    };

    return await callApi(envConfig.mailer.uri, {
      method: 'POST',
      headers: {
        'Content-Length': new Buffer(JSON.stringify(postData)).length,
      },
      body: postData,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const sendEmailWithTemplate = async ({
  templateFile,
  fromName = envConfig.mailer.fromName,
  fromEmail = envConfig.mailer.fromEmail,
  toName,
  toEmail,
  subject,
  ...anotherParams,
}) => {
  try {
    const viewData = {
      toName,
      ...anotherParams,
    };

    const templatePath = path.resolve('./server/templates/email', templateFile);
    const template = swig.compileFile(templatePath);
    const emailBody = template(viewData);

    return await sendMail({
      fromName,
      fromEmail,
      toName,
      toEmail,
      subject,
      body: emailBody,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};

export const sendEmailWithoutTemplate = async ({
  fromName = envConfig.mailer.fromName,
  fromEmail = envConfig.mailer.fromEmail,
  toName,
  toEmail,
  subject,
  content,
}) => {
  try {
    return await sendMail({
      fromName,
      fromEmail,
      toName,
      toEmail,
      subject,
      body: content,
    });
  } catch (e) {
    log.error(e);

    return Promise.resolve();
  }
};
