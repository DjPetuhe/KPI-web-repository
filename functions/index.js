"use strict";
// const sanitizeHtml = require("sanitize-html");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// const rateLimit = {
//   limit: 10,
//   recentIps: new Map(),
// };
//
// const zeroRecord = {
//   count: 0,
//   date: new Date(0),
// };

const testAccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {
  functions.logger.log("check1");
  functions.logger.log(req.body);
  functions.logger.log("check2");
  // const reqIp = req.headers['fastly-client-ip'];
  // const now = new Date();
  // let ipUser = rateLimit.ipCache.get(reqIp) ?? {
  //   reqCount: 0,
  //   time: now - rateLimit.timeInSeconds * 1000,
  // };
  //
  // functions.logger.log('current time: ' + (now - ipUser.time));
  // functions.logger.log('requests count: ' + ipUser.reqCount);
  // if (
  //   ipUser.reqCount + 1 > rateLimit.callLimitForOneIp ||
  //   now - ipUser.time < rateLimit.timeInSeconds * 1000
  // ) {
  //  return res.status(429).json({ code: '429', error: 'Too many requests!' });
  // }
  // ipUser.reqCount++;
  // ipUser.time = new Date();
  // rateLimit.ipCache.set(reqIp, ipUser);
  //
  // if (!Object.keys(req.body ?? {}).length) {
  //   return res.status(400).json({ code: 400, error: 'No message!' });
  // }
  //
  // let lines = Object.entries(req.body)
  //   .map(([key, val]) => `<p><b>${key}: </b>${val}</p>`)
  //   .join('\n');
  // let html = `<p><b>Message from contact form:</b>${lines}</p>`;
  // const htmlSan = sanitizeHtml(html);

  const mailOptions = {
    from: "<testAccount.email>",
    to: "validhernufKP@gmail.com",
    subject: "Attachments",
    text: "This message with attachments.",
    // html: htmlSan, // html body
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending mail", error.message);
      return res.status(500).json({ code: "500", error: error.message });
    }
    return res.status(200).json({ data: "ok" });
  });
});

// await transporter.sendMail({
//   from: '"2lab" <testAccount.email>',
//   to: 'user@example.com, user@example.com',
//   subject: 'Attachments',
//   text: 'This message with attachments.',
//   html:
//     'This <i>message</i> with <strong>attachments</strong>.',
//   attachments: [
//     { filename: 'greetings.txt', path: '/assets/files/' },
//     {
//       filename: 'greetings.txt',
//       content: 'Message from file.',
//     },
//     { path: 'data:text/plain;base64,QmFzZTY0IG1lc3NhZ2U=' },
//     {
//       raw: `
//           Content-Type: text/plain
//           Content-Disposition: attachment;
//
//           Message from file.
//         `,
//     },
//   ],
// })
