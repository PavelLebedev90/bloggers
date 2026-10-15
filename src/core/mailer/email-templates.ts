import { smtpEnv } from "../config/smtp.config";
import { renderTemplate } from "./render-template";
import { registrationConfirmationTemplate } from "./templates/registration-confirmation.template";

const EMAIL_CONFIRMATION_TTL_MINUTES = 10;

export const emailTemplates = {
  registrationConfirmation(params: { login: string; code: string }): {
    subject: string;
    html: string;
  } {
    const confirmationUrl = `${smtpEnv.SMTP_CONFIRMATION_URL}/confirm-email?code=${encodeURIComponent(params.code)}`;
    const html = renderTemplate(registrationConfirmationTemplate, {
      login: params.login,
      confirmationUrl,
      expiresInMinutes: EMAIL_CONFIRMATION_TTL_MINUTES,
      year: new Date().getFullYear(),
    });
    return {
      subject: "Подтверждение регистрации в Bloggers",
      html,
    };
  },
};
