import nodemailer, { Transporter } from "nodemailer";
import { smtpEnv } from "../config/smtp.config";

type MaxAttempt = 1 | 2 | 3 | 4 | 5;
export type SendMailParams = {
  to: string;
  subject: string;
  html: string;
  maxAttempt?: MaxAttempt;
};

const RETRY_DELAYS_MS = [500, 1000, 2000, 2500, 2500];

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpEnv.SMTP_HOST,
      port: smtpEnv.SMTP_PORT,
      secure: smtpEnv.SMTP_SECURE,
      auth: {
        user: smtpEnv.SMTP_USER,
        pass: smtpEnv.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const sendMailAttempt = async (
  { to, subject, html }: Omit<SendMailParams, "maxAttempt">,
  maxAttempt: number,
  curAttempt: number,
): Promise<void> => {
  try {
    await getTransporter().sendMail({
      from: smtpEnv.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    const retryDelay = RETRY_DELAYS_MS[curAttempt];
    if (retryDelay === undefined || curAttempt + 1 >= maxAttempt) throw error;
    await delay(retryDelay);
    await sendMailAttempt({ to, subject, html }, maxAttempt, curAttempt + 1);
  }
};

export const smtpAdapter = {
  /** Отправляет письмо с повторными попытками (от 1 до 5 попыток, backoff 500ms/1s/2s/2.5s). Бросает последнюю ошибку, если все попытки провалились. */
  async sendMail({ to, subject, html, maxAttempt = 3 }: SendMailParams): Promise<void> {
    await sendMailAttempt({ to, subject, html }, maxAttempt, 0);
  },
};
