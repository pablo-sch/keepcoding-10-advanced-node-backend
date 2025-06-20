import nodemailer from "nodemailer";
import cleanEnvVar from "./utils.js";

export function createTransport() {
  const options = {
    service: cleanEnvVar(process.env.EMAIL_SERVICE_NAME),
    host: cleanEnvVar(process.env.EMAIL_SERVICE_HOST),
    port: Number(cleanEnvVar(process.env.EMAIL_SERVICE_PORT)),
    secure: cleanEnvVar(process.env.EMAIL_SERVICE_SECURE) === "true",
    auth: {
      user: cleanEnvVar(process.env.EMAIL_SERVICE_USER),
      pass: cleanEnvVar(process.env.EMAIL_SERVICE_PASSWORD),
    },
  };

  return nodemailer.createTransport(options);
}

export async function sendEmail({ transport, to, subject, body }) {
  const result = await transport.sendMail({
    from: cleanEnvVar(process.env.EMAIL_SERVICE_FROM),
    to,
    subject,
    html: body,
  });
  return result;
}

export function generatePreviewURL(sendResult) {
  return nodemailer.getTestMessageUrl(sendResult);
}
