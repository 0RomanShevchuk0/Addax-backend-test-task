import nodemailer from "nodemailer"
import { env } from "../config/env"

class EmailService {
  private transporter

  constructor() {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.error("SMTP_USER or SMTP_PASS variable is missing.")
    }

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  }

  async sendWelcomeEmail(email: string, name?: string | null) {
    const frontAppUrl = process.env.FRONTEND_URL

    const frontendAuthUrl = `${frontAppUrl}/auth`

    return this.transporter.sendMail({
      from: '"Addax Team" <no-reply@addax.com>',
      to: email,
      subject: "Welcome to Addax",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Welcome to Addax</h2>
          <p>Hi ${name ?? "user"},</p>
          <p>Thank you for signing up! We are excited to have you onboard.</p>
          <p>Please click the button below to log in to your account:</p>
          <a href="${frontendAuthUrl}" 
            style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Log in to Your Account
          </a>
          <p>If you didn’t sign up for this, feel free to ignore this email.</p>
          <p>Best regards, <br> Addax Team</p>
        </div>
      `,
    })
  }
}

export const emailService = new EmailService()
