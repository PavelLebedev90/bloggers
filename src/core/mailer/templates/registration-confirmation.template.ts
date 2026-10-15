export const registrationConfirmationTemplate = /* html */ `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Подтверждение регистрации</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background-color:#4f46e5; padding:28px 32px;">
                <span style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:0.3px;">Bloggers</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px; font-size:20px; line-height:28px; color:#111827;">
                  Привет, {{login}}!
                </h1>
                <p style="margin:0 0 24px; font-size:15px; line-height:22px; color:#4b5563;">
                  Спасибо за регистрацию. Чтобы активировать аккаунт, подтвердите свой email — это займёт одну секунду.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px; background-color:#4f46e5;">
                      <a
                        href="{{{confirmationUrl}}}"
                        target="_blank"
                        style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;"
                      >
                        Подтвердить email
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0; font-size:13px; line-height:20px; color:#9ca3af;">
                  Если кнопка не работает, скопируйте и вставьте в браузер эту ссылку:
                </p>
                <p style="margin:6px 0 0; font-size:13px; line-height:20px; word-break:break-all;">
                  <a href="{{{confirmationUrl}}}" target="_blank" style="color:#4f46e5; text-decoration:underline;">{{{confirmationUrl}}}</a>
                </p>
                <p style="margin:24px 0 0; font-size:13px; line-height:20px; color:#9ca3af;">
                  Ссылка действительна {{expiresInMinutes}} минут. Если вы не регистрировались в Bloggers, просто игнорируйте это письмо.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #eef0f2;">
                <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af;">
                  © {{year}} Bloggers. Это автоматическое письмо, отвечать на него не нужно.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
