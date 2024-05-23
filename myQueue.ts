import Queue from 'bull';
import nodemailer from 'nodemailer';
require('dotenv').config();

const redisConfig = {
  redis: {
    host: 'localhost',
    port: 6379
  }
};

const myQueue = new Queue('send-email', redisConfig);

myQueue.process('send-email', async (job: Queue.Job<any>, done: Queue.DoneCallback) => {
  console.log(job.data);
  if (typeof job.data === 'string') done(new Error());
  else done(null, job.data.code);
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

myQueue.on('completed', async (_, result: string) => {
  await transporter.sendMail({
    from: 'Voucher admin',
    to: process.env.RECEIVER,
    subject: 'Issue voucher notification',
    html: `<h3>Hello!</h3><p>System has issued a voucher with code ${result}</p><div>Best regards.</div>`
  });
});

myQueue.on('failed', async (_, err: Error) => {
  await transporter.sendMail({
    from: 'Voucher admin',
    to: process.env.RECEIVER,
    subject: 'Issue voucher notification',
    html: `<h3>Hello!</h3><p>Issue voucher meet error</p><div>Best regards.</div>`
  });
});

export default myQueue;
