import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function renderEmailTemplate(
  template: string,
  data: Record<string, any>
): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "templates",
    `${template}.ejs`
  );
  return ejs.renderFile(templatePath, data);
}

// send email
export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>,
  retries: number = 0
) => {
  if (retries < 3) {
    try {
      const html = await renderEmailTemplate(template, data);
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      };
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  } else {
    console.error("Max retries reached for sending email:", template);
    return true;
  }
};
