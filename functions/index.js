
const sanitizeHtml = require('sanitize-html');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const configInfo = functions.config();

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: configInfo.formlab.email,
      pass: configInfo.formlab.password,
    },
  },
  {
    from: `Mailer Test <${configInfo.formlab.email}>`,
  },
);

function createMailOptions(body) {
  const lines = Object.entries(body)
    .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
    .join('\n');
  const ClearHtml = sanitizeHtml(
    `<p><b>Form from second lab work:</b></p> ${lines}`,
  );
  return {
    from: `<${configInfo.formlab.email}>`,
    to: `<${configInfo.formlab.emailsent}>`,
    subject: 'Form form second lab work',
    html: ClearHtml,
  };
}

const rateLimit = {
  limitPerIP: 5,
  recentIpCache: new Map(),
};

const newSender = {
  reqCount: 0,
  reqTime: new Date(0),
};

exports.sendMail = functions.https.onRequest((req, res) => {
  const mailOptions = createMailOptions(req.body);
  const SenderIp = req.header['fastly-client-ip'] || 'local';
  const SenderReq = rateLimit.recentIpCache.get(SenderIp) ?? newSender;
  if (
    SenderReq.reqCount + 1 > rateLimit.limitPerIP ||
    new Date().getTime() - SenderReq.reqTime.getTime() < 50000
  ) {
    return res.status(429).json({ code: '429', error: 'Too many requests!' });
  }
  if (!Object.keys(req.body ?? {}).length) {
    return res.status(400).json({ code: 400, error: 'No message!' });
  }
  rateLimit.recentIpCache.set(SenderIp, {
    reqCount: SenderReq.reqCount + 1,
    reqTime: new Date(),
  });
  transporter.sendMail(mailOptions, error => {
    if (error) {
      console.error('Error!', error.message);
      return res.status(500).json({ code: '500', error: error.message });
    }
    return res.status(200).json({ data: 'ok' });
  });
  return null;
});
