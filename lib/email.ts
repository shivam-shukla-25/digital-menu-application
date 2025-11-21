import nodemailer from "nodemailer";

const FROM_EMAIL = "noreply@digitmenu.com"; // Update after domain setup
const SENDER_NAME = "DigiMenu";

const transporter = nodemailer.createTransport({
  service: "gmail", // or smtp config if using custom domain
  auth: {
    user: process.env.AUTH_EMAIL, // your email id
    pass: process.env.AUTH_PASSWORD, // app password (for gmail use App Password)
  },
});


export async function sendVerificationEmail(
  email: string,
  code: string,
  fullName?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    
    const displayName = fullName ? fullName.split(" ")[0] : "there"

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0 0 5px 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 0; font-size: 14px; opacity: 0.9; }
            .content { background: #f9fafb; padding: 30px 20px; }
            .content p { margin: 0 0 15px 0; }
            .code-box { background: white; border: 2px solid #667eea; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Monaco', 'Courier New', monospace; }
            .expiry-warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0; border-radius: 4px; font-size: 14px; color: #78350f; }
            .footer { font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DigiMenu</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <p>Hi ${displayName},</p>
              <p>Welcome to DigiMenu! To complete your registration or sign in, please use the verification code below:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <div class="expiry-warning">
                <strong>This code will expire in 10 minutes.</strong> If you didn't request this code, you can safely ignore this email.
              </div>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <div class="footer">
                <p>DigiMenu - Digital Menu Management System</p>
                <p>&copy; ${new Date().getFullYear()} DigiMenu. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    console.log(`[v0] Sending verification email to: ${email}`)

    const info = await transporter.sendMail({
      from: `${SENDER_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Your DigiMenu Verification Code: ${code}`,
      html: htmlContent,
    });

    console.log(`[v0] Email successfully sent to ${email} (Message ID: ${info.messageId})`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Email Service Exception:", error)
    return { success: false, error: "Email service temporarily unavailable" }
  }
}
