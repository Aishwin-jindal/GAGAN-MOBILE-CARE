import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Custom Vite Plugin for Backend Email OTP Endpoint
function emailOtpPlugin() {
  return {
    name: 'email-otp-server-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { email, otp, purpose } = JSON.parse(body || '{}');

            if (!email || !otp) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Email and OTP are required.' }));
              return;
            }

            console.log(`\n========================================`);
            console.log(`📩 [GAGAN MOBILE CARE] SENDING REAL OTP EMAIL`);
            console.log(`To: ${email}`);
            console.log(`Purpose: ${purpose || 'Authentication'}`);
            console.log(`Code: ${otp}`);
            console.log(`========================================\n`);

            // Check if user has configured custom SMTP / Gmail credentials in .env
            const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
            const smtpPort = parseInt(process.env.SMTP_PORT || '465');
            const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
            const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

            let transporter;

            if (smtpUser && smtpPass) {
              transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass
                }
              });
            } else {
              // Create dynamic ethereal test account or fallback transporter
              const testAccount = await nodemailer.createTestAccount();
              transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                  user: testAccount.user,
                  pass: testAccount.pass
                }
              });
            }

            // HTML Email Template
            const mailOptions = {
              from: `"Gagan Mobile Care" <${smtpUser || 'auth@gaganmobilecare.com'}>`,
              to: email,
              subject: `Gagan Mobile Care - Your Verification Code is [${otp}]`,
              text: `Your Gagan Mobile Care verification code is: ${otp}. Valid for 5 minutes.`,
              html: `
                <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #0d131f; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #1f293d;">
                  <div style="background: linear-gradient(135deg, #00f0ff 0%, #0070f3 100%); padding: 24px; text-align: center;">
                    <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 900; letter-spacing: 1px;">GAGAN MOBILE CARE</h1>
                    <p style="margin: 4px 0 0 0; color: #000000; font-size: 12px; font-weight: 600;">Maur Mandi, Punjab • Official Mobile Care</p>
                  </div>
                  <div style="padding: 30px 24px; text-align: center;">
                    <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Email Verification Code</h2>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
                      Please use the following 6-digit verification code to complete your ${purpose || 'login/registration'} for Gagan Mobile Care.
                    </p>
                    <div style="margin: 28px 0; padding: 18px; background: #080b11; border: 2px dashed #00f0ff; border-radius: 12px; display: inline-block;">
                      <span style="font-family: monospace; font-size: 36px; font-weight: 900; color: #00f0ff; letter-spacing: 8px;">
                        ${otp}
                      </span>
                    </div>
                    <p style="color: #f59e0b; font-size: 12px; margin: 0;">
                      ⏳ This code is valid for 5 minutes. Do not share this OTP with anyone.
                    </p>
                  </div>
                  <div style="background-color: #080b11; padding: 16px 24px; text-align: center; border-top: 1px solid #1f293d;">
                    <p style="color: #64748b; font-size: 11px; margin: 0;">
                      Need help? Call Gagan Mobile Care at <strong>+91 98726-22624</strong>
                    </p>
                  </div>
                </div>
              `
            };

            const info = await transporter.sendMail(mailOptions);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
              console.log(`🔗 Ethereal Email Preview URL: ${previewUrl}`);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: `OTP sent successfully to ${email}`,
                previewUrl: previewUrl || null,
                isLiveSmtp: Boolean(smtpUser && smtpPass),
                code: !smtpUser ? otp : undefined // Include fallback code for sandbox preview
              })
            );
          } catch (err) {
            console.error('Failed to send mail:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Failed to dispatch email.' }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), emailOtpPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
