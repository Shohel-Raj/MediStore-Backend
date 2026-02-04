import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  emailVerification:{
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  sendVerificationEmail: async ({
    user,
    url,
    token,
  }: {
    user: { email: string; name?: string };
    url: string;
    token: string;
  }) => {
    try {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: `"mediStore" <${process.env.APP_USER}>`,
        to: user.email,
        subject: "Please verify your email!",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-scheme" content="light dark" />
  <title>Verify Your Email - Medi Store</title>

  <style type="text/css">
    /* Reset */
    body, table, td, a { margin:0; padding:0; border:0; }
    body { 
      -webkit-font-smoothing: antialiased; 
      -moz-osx-font-smoothing: grayscale; 
      background-color: #f8fafc; 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body { background-color: #0f172a; color: #e2e8f0; }
      .container { background-color: #1e293b; }
      .header { background: linear-gradient(135deg, #1e40af, #3b82f6); }
      .content { color: #cbd5e1; }
      .footer { background-color: #111827; color: #94a3b8; }
      .link { color: #93c5fd; }
    }

    .container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
    }

    .header {
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      padding: 32px 24px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .content {
      padding: 36px 32px 32px;
    }

    .content h2 {
      margin: 0 0 20px;
      font-size: 22px;
      font-weight: 600;
      color: #0f172a;
    }

    .greeting {
      margin-bottom: 24px;
      font-size: 16px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0 40px;
    }

    .verify-button {
      display: inline-block;
      background: linear-gradient(to right, #2563eb, #3b82f6);
      color: white !important;
      padding: 16px 40px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(37,99,235,0.25);
      transition: all 0.2s ease;
    }

    .verify-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37,99,235,0.35);
      background: linear-gradient(to right, #1d4ed8, #2563eb);
    }

    .fallback-link {
      margin: 20px 0;
      padding: 16px;
      background-color: #f1f5f9;
      border-radius: 10px;
      font-size: 14px;
      word-break: break-all;
      color: #1e40af;
      border: 1px solid #e2e8f0;
    }

    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }

    .small {
      font-size: 14px;
      color: #64748b;
      margin: 16px 0 0;
    }

    @media only screen and (max-width: 600px) {
      .container { margin: 20px !important; border-radius: 12px; }
      .content { padding: 28px 20px 24px !important; }
      .header { padding: 28px 20px !important; }
      .verify-button { padding: 15px 36px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>Medi Store</h1>
    </div>

    <!-- Main Content -->
    <div class="content">

      <h2>Confirm your email address</h2>

      <p class="greeting">Hi ${user.name ?? 'there'},</p>

      <p>
        Thanks for signing up to <strong>Medi Store</strong>!<br>
        To get started and activate your account, please verify your email address.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button" target="_blank">
          Verify Email Address
        </a>
      </div>

      <p class="small">
        Button not working? Copy and paste this link into your browser:
      </p>

      <div class="fallback-link">
        ${verificationUrl}
      </div>

      <p class="small">
        This link will expire in 24 hours for security reasons.<br>
        If you didn’t create an account with us, feel free to ignore this email.
      </p>

      <p style="margin-top: 32px;">
        Happy shoping,<br>
        <strong>The Medi Store Team</strong>
      </p>

    </div>

    <!-- Footer -->
    <div class="footer">
      © ${new Date().getFullYear()} Medi Store • All rights reserved<br>
      <span style="color:#94a3b8;">You’re receiving this because you registered at mediStore.com</span>
    </div>

  </div>

</body>
</html>
`,
      });

    } catch (err) {
      console.error(err);
      throw err;
    }
  },},
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
