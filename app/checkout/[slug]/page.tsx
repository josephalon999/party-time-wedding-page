"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";

/* ─────────────────────────────────────────────
   PACKAGE DATA
   TODO: החלף את CARDCOM_URL בכל מסלול
   בלינק האמיתי מקארדקום שלך
───────────────────────────────────────────── */
const PACKAGES: Record<string, {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  image: string;
  imageAlt: string;
  cardcomUrl: string;
  badge?: string;
}> = {
  digital: {
    name: "קורס דיגיטלי",
    price: "197",
    tagline: "להתחיל לבד, בקצב שלכם",
    features: [
      "קורס וידאו מלא לשחרור ברחבה",
      "שחרור לכל סגנון מוזיקה",
      "גישה מיידית ולצמיתות",
      "צפייה בלתי מוגבלת מכל מכשיר",
    ],
    image: "/images/digital.png",
    imageAlt: "קורס Party Time הדיגיטלי",
    cardcomUrl: "https://YOUR_CARDCOM_URL_DIGITAL",
  },
  basic: {
    name: "דיגיטלי + שיעור פרטי",
    price: "970",
    tagline: "קורס + מגע אישי",
    features: [
      "קורס דיגיטלי מלא",
      "שיעור פרטי אחד עם יוסף (90 דקות)",
      "שחרור לכל סגנון מוזיקה",
      "מותאם לכם כזוג",
    ],
    image: "/images/couple2.jpg",
    imageAlt: "זוג רוקד סלואו אלגנטי",
    cardcomUrl: "https://YOUR_CARDCOM_URL_BASIC",
  },
  standard: {
    name: "דיגיטלי + 2 שיעורים",
    price: "1,500",
    tagline: "כשרוצים לבוא מוכנים",
    features: [
      "קורס דיגיטלי מלא",
      "2 שיעורים פרטיים עם יוסף",
      "בניית ריקוד מותאם אישית לזוג",
      "שחרור לכל סגנון מוזיקה",
    ],
    image: "/images/couple.png",
    imageAlt: "זוג רוקד חופשי במסיבה",
    cardcomUrl: "https://YOUR_CARDCOM_URL_STANDARD",
  },
  full: {
    name: "החבילה המלאה",
    price: "2,600",
    tagline: "מהפחד — לריקוד שיזכרו",
    badge: "⭐ הכי פופולרי",
    features: [
      "קורס דיגיטלי מלא",
      "4 מפגשים פרטיים עם יוסף",
      "הרכבת ריקוד הסלואו המלא שלכם",
      "שחרור לכל סגנון — כל הלילה",
      "ליווי וואטסאפ 30 יום לתרגול",
      "נכנסים לחתונה מוכנים ומשוחררים",
    ],
    image: "/images/wedding.png",
    imageAlt: "חתן וכלה רוקדים בחתונה",
    cardcomUrl: "https://YOUR_CARDCOM_URL_FULL",
  },
};

/* ─────────────────────────────────────────────
   RAVMESAGE WEBHOOK
   TODO: החלף בכתובת ה-Webhook מהרב-מסר שלך
───────────────────────────────────────────── */
const RAVMESAGE_WEBHOOK_URL = "https://YOUR_RAVMESAGE_WEBHOOK_URL_HERE";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const pkg = PACKAGES[params.slug];
  if (!pkg) notFound();

  const [form, setForm] = useState({ name: "", phone: "", email: "", consent: false });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "שדה חובה";
    if (!form.phone.trim()) e.phone = "שדה חובה";
    if (!form.email.trim()) e.email = "שדה חובה";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "כתובת מייל לא תקינה";
    if (!form.consent) e.consent = "יש לאשר את התנאים להמשך";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    try {
      await fetch(RAVMESAGE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          consent: true,
          package: pkg.name,
          price: pkg.price,
          group: "דף מכירה פארטי טיים חתן כלה",
          source: `checkout-${params.slug}`,
        }),
      });
      setStatus("success");
      setTimeout(() => { window.location.href = pkg.cardcomUrl; }, 1200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      {/* Logo / back link */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <a href="/" className="font-serif font-bold text-gold text-sm hover:text-gold-light transition-colors">
          ← חזרה לדף הראשי
        </a>
        <span className="text-cream-muted text-xs">תשלום מאובטח דרך קארדקום 🔒</span>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT — Package details + image */}
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* Badge */}
          {pkg.badge && (
            <motion.div variants={fadeUp}
              className="inline-block text-sm font-bold px-4 py-1 rounded-full mb-4"
              style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}>
              {pkg.badge}
            </motion.div>
          )}

          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-1">
            Party Time למתחתנים
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif font-black text-3xl md:text-4xl text-cream-DEFAULT mb-1">
            {pkg.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-cream-muted mb-5">{pkg.tagline}</motion.p>

          <motion.div variants={fadeUp} className="mb-6">
            <span className="font-black text-5xl text-cream-DEFAULT">{pkg.price}</span>
            <span className="text-cream-muted text-lg mr-1">₪</span>
          </motion.div>

          {/* Features */}
          <motion.ul variants={stagger} className="space-y-3 mb-8">
            {pkg.features.map((f) => (
              <motion.li key={f} variants={fadeUp} className="flex gap-3 items-start text-cream-muted">
                <span className="text-gold mt-0.5 flex-shrink-0 text-lg">✓</span>
                <span>{f}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Image */}
          <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.imageAlt}
              className="w-full object-cover rounded-2xl"
              style={{ maxHeight: 280, objectPosition: "center 30%" }}
            />
            <div className="absolute inset-0 rounded-2xl"
              style={{ border: "1px solid rgba(212,175,55,0.3)",
                background: "linear-gradient(to top, rgba(18,11,26,0.5) 0%, transparent 60%)" }} />
          </motion.div>
        </motion.div>

        {/* RIGHT — Lead form */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl p-7 sticky top-8"
          style={{ background: "#1e1330", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-serif text-2xl text-gold mb-2">מעבר לתשלום...</h2>
              <p className="text-cream-muted">מיד תועברו לדף התשלום המאובטח של קארדקום.</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif font-bold text-2xl text-cream-DEFAULT mb-1 text-center">
                כמעט שם!
              </h2>
              <p className="text-cream-muted text-sm text-center mb-6">
                מלאו פרטים ואנחנו מעבירים אתכם לתשלום המאובטח
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-sm text-cream-muted mb-1">שם מלא *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
                    placeholder="ישראל ישראלי"
                    className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/40 focus:outline-none focus:ring-2 focus:ring-gold"
                    style={{ background: "rgba(18,11,26,0.8)", border: `1px solid ${errors.name ? "#f87171" : "rgba(212,175,55,0.3)"}` }}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-cream-muted mb-1">טלפון *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: "" })); }}
                    placeholder="050-0000000"
                    className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/40 focus:outline-none focus:ring-2 focus:ring-gold"
                    style={{ background: "rgba(18,11,26,0.8)", border: `1px solid ${errors.phone ? "#f87171" : "rgba(212,175,55,0.3)"}` }}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-cream-muted mb-1">אימייל *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                    placeholder="email@example.com"
                    className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/40 focus:outline-none focus:ring-2 focus:ring-gold"
                    style={{ background: "rgba(18,11,26,0.8)", border: `1px solid ${errors.email ? "#f87171" : "rgba(212,175,55,0.3)"}`,
                      direction: "ltr", textAlign: "right" }}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Spam consent */}
                <div>
                  <label className="flex gap-3 items-start cursor-pointer">
                    <div className="relative mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => { setForm(p => ({ ...p, consent: e.target.checked })); setErrors(p => ({ ...p, consent: "" })); }}
                        className="sr-only"
                      />
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                        style={{
                          background: form.consent ? "#D4AF37" : "transparent",
                          border: `2px solid ${errors.consent ? "#f87171" : form.consent ? "#D4AF37" : "rgba(212,175,55,0.4)"}`,
                        }}
                      >
                        {form.consent && <span className="text-bg-primary text-xs font-bold">✓</span>}
                      </div>
                    </div>
                    <span className="text-cream-muted text-xs leading-relaxed">
                      אני מאשר/ת קבלת עדכונים, תכנים ומידע שיווקי מ-
                      <span className="text-cream-DEFAULT">Passion For Action</span>
                      {" "}בכל ערוץ תקשורת (מייל, SMS, וואטסאפ).
                      ניתן לבטל את ההסכמה בכל עת בפנייה אלינו. בהתאם לחוק התקשורת (בזק ושידורים) תשמ&quot;ב-1982.
                    </span>
                  </label>
                  {errors.consent && <p className="text-red-400 text-xs mt-1 mr-8">{errors.consent}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-xl py-4 font-black text-lg mt-1 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === "loading" ? "שולח..." : `לתשלום מאובטח — ${pkg.price} ₪ ←`}
                </motion.button>

                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    משהו השתבש. נסו שוב או{" "}
                    <a href="https://wa.me/972YOUR_PHONE" className="underline text-gold" target="_blank" rel="noopener noreferrer">
                      צרו קשר בוואטסאפ
                    </a>
                  </p>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-2 pt-4"
                  style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
                  <span className="text-cream-muted/50 text-xs flex items-center gap-1">🔒 תשלום מאובטח</span>
                  <span className="text-cream-muted/50 text-xs">|</span>
                  <span className="text-cream-muted/50 text-xs flex items-center gap-1">🛡️ קארדקום</span>
                  <span className="text-cream-muted/50 text-xs">|</span>
                  <span className="text-cream-muted/50 text-xs flex items-center gap-1">✅ SSL</span>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-16 pt-6 text-center text-cream-muted/30 text-xs"
        style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
        © {new Date().getFullYear()} Passion For Action | יוסף אלון · תנועה יוצרת מציאות
      </div>
    </main>
  );
}
