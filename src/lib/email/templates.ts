import { siteUrl } from "@/lib/env";
import type { EmailMessage } from "./provider";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const SITE = "Federal Ministry of Transportation website";

function layout(heading: string, intro: string, cta: string, link: string, footnote: string) {
  const html = `<!doctype html><html><body style="margin:0;background:#f5f3ee;font-family:Arial,Helvetica,sans-serif;color:#111827">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;padding:32px;max-width:520px">
<tr><td style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#007d53;font-weight:bold">${escape(SITE)}</td></tr>
<tr><td style="font-size:22px;font-weight:bold;padding:12px 0">${escape(heading)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#45566b;padding-bottom:20px">${escape(intro)}</td></tr>
<tr><td><a href="${escape(link)}" style="display:inline-block;background:#007d53;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:6px">${escape(cta)}</a></td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#45566b;padding-top:24px">If the button does not work, copy this link into your browser:<br><span style="word-break:break-all">${escape(link)}</span></td></tr>
<tr><td style="font-size:12px;line-height:1.6;color:#6b7280;padding-top:20px;border-top:1px solid #e5e1d8;margin-top:20px">${escape(footnote)}</td></tr>
</table></td></tr></table></body></html>`;
  return html;
}

/** Links are always built from the configured site URL — never from a request's Host header. */
export function inviteEmail(to: string, name: string, token: string): EmailMessage & { link: string } {
  const link = `${siteUrl()}/admin/accept-invite/${token}`;
  const intro = `Hello ${name}, you have been invited to manage content on the Ministry's website. Choose a password to activate your account. This link works once and expires in 72 hours.`;
  return {
    to,
    link,
    subject: "You're invited to the Ministry website admin",
    text: `${intro}\n\nActivate your account: ${link}\n\nIf you were not expecting this, you can ignore this email.`,
    html: layout("You're invited", intro, "Activate your account", link, "If you were not expecting this, you can ignore this email."),
  };
}

export function resetEmail(to: string, name: string, token: string): EmailMessage & { link: string } {
  const link = `${siteUrl()}/admin/reset-password/${token}`;
  const intro = `Hello ${name}, we received a request to reset your password. This link works once and expires in 60 minutes.`;
  return {
    to,
    link,
    subject: "Reset your Ministry website admin password",
    text: `${intro}\n\nChoose a new password: ${link}\n\nIf you did not ask for this, ignore this email — your password is unchanged.`,
    html: layout("Reset your password", intro, "Choose a new password", link, "If you did not ask for this, ignore this email — your password is unchanged."),
  };
}
