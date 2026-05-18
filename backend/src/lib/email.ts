import { Resend } from "resend"

import { env } from "../config/env.js"

const resend = new Resend(env.EMAIL.RESEND_API_KEY)

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string
  resetUrl: string
}) {
  void resend.emails.send({
    from: env.EMAIL.FROM,
    to,
    subject: "Reset Password",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>Reset Password</h2>
        <p>Klik tombol di bawah untuk mereset password Anda.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #fff; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          Jika Anda tidak meminta reset password, abaikan email ini.
        </p>
      </div>
    `,
  })
}