import nodemailer from "nodemailer";
import { env } from "../../config/env.js";
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}
function formatField(value, fallback = "Chưa cung cấp") {
    return value && value.trim() ? value.trim() : fallback;
}
function formatSubmittedAt(date) {
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "Asia/Ho_Chi_Minh"
    }).format(date);
}
function createEmailSubject(payload) {
    return `[WhiteSpace] Liên hệ mới từ ${payload.name}`;
}
function createEmailText(payload) {
    return [
        "Bạn vừa nhận được một yêu cầu liên hệ mới từ website WhiteSpace.",
        "",
        `Khách hàng: ${payload.name}`,
        `Số điện thoại: ${payload.phone}`,
        `Email: ${formatField(payload.email)}`,
        `Nguồn: ${formatField(payload.source, "website")}`,
        `Thời gian gửi: ${formatSubmittedAt(payload.createdAt)}`,
        `Mã liên hệ: ${payload.id}`,
        "",
        "Nội dung:",
        formatField(payload.message)
    ].join("\n");
}
function createEmailHtml(payload) {
    const message = escapeHtml(formatField(payload.message)).replaceAll("\n", "<br />");
    return `
    <div style="margin:0;padding:32px 16px;background:#f4f1ea;font-family:Arial,sans-serif;color:#1f2937;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e7e1d6;">
        <div style="padding:24px 28px;background:linear-gradient(135deg,#102542,#1f4b7a);color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.82;">WhiteSpace</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.3;">Có khách hàng mới gửi form liên hệ</h1>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.7;opacity:0.9;">Thông tin được gửi tự động từ website và cần được phản hồi sớm.</p>
        </div>
        <div style="padding:28px;">
          <div style="display:grid;gap:12px;">
            <div style="padding:16px 18px;border:1px solid #e7e1d6;border-radius:18px;background:#faf8f3;">
              <strong style="display:block;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280;">Khách hàng</strong>
              <div style="margin-top:8px;font-size:20px;font-weight:700;color:#102542;">${escapeHtml(payload.name)}</div>
            </div>
            <div style="padding:16px 18px;border:1px solid #e7e1d6;border-radius:18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6b7280;">Số điện thoại</td>
                  <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(payload.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6b7280;">Email</td>
                  <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(formatField(payload.email))}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6b7280;">Nguồn</td>
                  <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(formatField(payload.source, "website"))}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6b7280;">Thời gian gửi</td>
                  <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(formatSubmittedAt(payload.createdAt))}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#6b7280;">Mã liên hệ</td>
                  <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;">${escapeHtml(payload.id)}</td>
                </tr>
              </table>
            </div>
            <div style="padding:18px;border:1px solid #e7e1d6;border-radius:18px;background:#fffdf8;">
              <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280;">Nội dung liên hệ</div>
              <div style="margin-top:10px;font-size:15px;line-height:1.8;color:#374151;">${message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `.trim();
}
function createTransporter() {
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_FROM_EMAIL) {
        return null;
    }
    const smtpUser = env.SMTP_USER.trim();
    const smtpPass = env.SMTP_PASS.replace(/\s+/g, "");
    return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
}
export async function sendContactNotificationEmail(notificationEmail, payload) {
    if (!notificationEmail) {
        console.info("[contact-email] skipped: notification email is empty", {
            contactId: payload.id
        });
        return;
    }
    const transporter = createTransporter();
    if (!transporter) {
        console.warn("[contact-email] skipped: SMTP is not configured", {
            contactId: payload.id,
            hasHost: Boolean(env.SMTP_HOST),
            hasPort: Boolean(env.SMTP_PORT),
            hasUser: Boolean(env.SMTP_USER),
            hasPass: Boolean(env.SMTP_PASS),
            hasFromEmail: Boolean(env.SMTP_FROM_EMAIL)
        });
        return;
    }
    console.info("[contact-email] sending", {
        contactId: payload.id,
        to: notificationEmail,
        from: env.SMTP_FROM_EMAIL,
        replyTo: payload.email ?? null
    });
    await transporter.sendMail({
        to: notificationEmail,
        from: env.SMTP_FROM_NAME
            ? `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`
            : env.SMTP_FROM_EMAIL,
        replyTo: payload.email ?? undefined,
        subject: createEmailSubject(payload),
        text: createEmailText(payload),
        html: createEmailHtml(payload)
    });
    console.info("[contact-email] sent", {
        contactId: payload.id,
        to: notificationEmail
    });
}
