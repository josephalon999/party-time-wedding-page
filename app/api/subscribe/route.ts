import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RESPONDER_API      = "https://graph.responder.live";
const CLIENT_ID          = process.env.RESPONDER_CLIENT_ID     || "";
const CLIENT_SECRET      = process.env.RESPONDER_CLIENT_SECRET || "";
const USER_TOKEN         = process.env.RESPONDER_USER_TOKEN    || "";
const LIST_ID            = process.env.RESPONDER_LIST_ID       || "";
const GMAIL_USER         = "josephalon999@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD      || "";

async function getResponderToken(): Promise<string> {
  const res = await fetch(`${RESPONDER_API}/v2/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      scope: "*",
      client_id: Number(CLIENT_ID),
      client_secret: CLIENT_SECRET,
      user_token: USER_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`Responder auth failed: ${res.status}`);
  const data = await res.json();
  if (!data.token) throw new Error("No token in Responder response");
  return data.token;
}

async function addToResponder(token: string, contact: {
  name: string; phone: string; email: string;
}) {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const lastName  = contact.name.split(" ").slice(1).join(" ") || "";

  const res = await fetch(`${RESPONDER_API}/v2/subscribers`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      email:      contact.email,
      first_name: firstName,
      last_name:  lastName,
      phone:      contact.phone,
      list_ids:   [Number(LIST_ID)],
    }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(`Responder subscribe failed: ${JSON.stringify(data)}`);
  return data;
}

async function sendBackupEmail(contact: {
  name: string; phone: string; email: string; packageName: string; price: string;
}) {
  if (!GMAIL_APP_PASSWORD) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"Party Time - ליד חדש" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `ליד חדש: ${contact.name} — ${contact.packageName}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #c9963f;">ליד חדש — Party Time למתחתנים</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">שם</td><td style="padding: 8px; border: 1px solid #ddd;">${contact.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">טלפון</td><td style="padding: 8px; border: 1px solid #ddd;">${contact.phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">מייל</td><td style="padding: 8px; border: 1px solid #ddd;">${contact.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">מסלול</td><td style="padding: 8px; border: 1px solid #ddd;">${contact.packageName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">מחיר</td><td style="padding: 8px; border: 1px solid #ddd;">${contact.price} ₪</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">זמן</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  let contact: { name: string; phone: string; email: string; packageName: string; price: string };
  try {
    const body = await req.json();
    contact = { name: body.name, phone: body.phone, email: body.email, packageName: body.packageName || "", price: body.price || "" };
    if (!contact.name || !contact.phone || !contact.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const results = { responder: false, email: false, errors: [] as string[] };

  // Responder
  try {
    const token = await getResponderToken();
    await addToResponder(token, contact);
    results.responder = true;
  } catch (err) {
    results.errors.push(`Responder: ${err}`);
    console.error("[subscribe] Responder error:", err);
  }

  // Gmail backup
  try {
    await sendBackupEmail(contact);
    results.email = true;
  } catch (err) {
    results.errors.push(`Email: ${err}`);
    console.error("[subscribe] Email error:", err);
  }

  // תמיד מחזיר 200 כדי שהלקוח יעבור לתשלום
  return NextResponse.json({ ok: true, ...results });
}
