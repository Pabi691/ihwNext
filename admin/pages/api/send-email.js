import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, message, customerName } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields: to, subject, message" });
  }

  // Build professional HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#04A9FF 0%,#0070cc 100%);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">IndianHairWorld</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:12px;letter-spacing:1px;">PREMIUM HAIR SOLUTIONS</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <p style="margin:0;font-size:16px;color:#1a1a2e;font-weight:600;">
                Dear ${customerName || "Valued Customer"},
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:16px 32px 32px 32px;">
              <div style="font-size:14px;line-height:1.7;color:#4a4a5a;white-space:pre-line;">${message}</div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #eef0f4;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 16px 32px;">
              <p style="margin:0;font-size:13px;color:#1a1a2e;font-weight:600;">Warm Regards,</p>
              <p style="margin:4px 0 0;font-size:13px;color:#04A9FF;font-weight:700;">Team IndianHairWorld</p>
            </td>
          </tr>

          <!-- Contact Bar -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table cellpadding="0" cellspacing="0" style="width:100%;background:#f8fafc;border-radius:10px;padding:14px 16px;">
                <tr>
                  <td style="font-size:12px;color:#6b7280;">
                    <strong style="color:#374151;">📍</strong> EC-20, Ground Floor, Salt Lake, Kolkata - 700064<br/>
                    <strong style="color:#374151;">📞</strong> +91 89611 94044 &nbsp;&nbsp;
                    <strong style="color:#374151;">✉</strong> indianhairworld1@gmail.com<br/>
                    <strong style="color:#374151;">🌐</strong> <a href="https://indianhairworld.com" style="color:#04A9FF;text-decoration:none;">www.indianhairworld.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom Branding -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #eef0f4;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                This email was sent by IndianHairWorld Admin. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "indianhairworld1@gmail.com",
        pass: "toaxdlqjmaivmfos",
      },
    });

    await transporter.sendMail({
      from: '"IndianHairWorld" <indianhairworld1@gmail.com>',
      to,
      subject,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
