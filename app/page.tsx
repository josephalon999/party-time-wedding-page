"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   LEAD MODAL
   TODO: החלף את RAVMESAGE_WEBHOOK_URL בכתובת
   ה-Webhook של קבוצת "דף מכירה פארטי טיים חתן כלה"
   מתוך חשבון הרב-מסר שלך
───────────────────────────────────────────── */
const RAVMESAGE_WEBHOOK_URL = "https://YOUR_RAVMESAGE_WEBHOOK_URL_HERE";

function LeadModal({
  isOpen,
  onClose,
  packageLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  packageLabel?: string;
}) {
  const [form, setForm] = useState({ name: "", phone: "", weddingDate: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch(RAVMESAGE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          wedding_date: form.weddingDate,
          group: "דף מכירה פארטי טיים חתן כלה",
          package: packageLabel || "general",
          source: "landing-page-wedding",
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl p-8"
            style={{ background: "#1e1330", border: "1px solid rgba(212,175,55,0.5)" }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-cream-muted hover:text-cream-DEFAULT text-2xl leading-none"
              aria-label="סגור"
            >
              ✕
            </button>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-serif text-2xl text-gold mb-2">קיבלנו!</h3>
                <p className="text-cream-muted">יוסף יצור איתכם קשר בקרוב לתיאום.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-gold mb-1 text-center">
                  {packageLabel ? `בחרתם: ${packageLabel}` : "קבעו שיחה עם יוסף"}
                </h3>
                <p className="text-cream-muted text-sm text-center mb-6">
                  ללא התחייבות — שיחה קצרה להכיר ולהתאים
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-cream-muted mb-1">שם מלא *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="השם שלכם"
                      className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/50 focus:outline-none focus:ring-2 focus:ring-gold"
                      style={{ background: "rgba(18,11,26,0.8)", border: "1px solid rgba(212,175,55,0.3)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream-muted mb-1">טלפון *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="050-0000000"
                      className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/50 focus:outline-none focus:ring-2 focus:ring-gold"
                      style={{ background: "rgba(18,11,26,0.8)", border: "1px solid rgba(212,175,55,0.3)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cream-muted mb-1">תאריך החתונה (בערך)</label>
                    <input
                      type="text"
                      name="weddingDate"
                      value={form.weddingDate}
                      onChange={handleChange}
                      placeholder="למשל: אוגוסט 2026"
                      className="w-full rounded-xl px-4 py-3 text-cream-DEFAULT placeholder-cream-muted/50 focus:outline-none focus:ring-2 focus:ring-gold"
                      style={{ background: "rgba(18,11,26,0.8)", border: "1px solid rgba(212,175,55,0.3)" }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-xl py-4 font-bold text-lg mt-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === "loading" ? "שולח..." : "אני רוצה את הרגע הזה ←"}
                  </motion.button>

                  {status === "error" && (
                    <p className="text-red-400 text-sm text-center">
                      משהו השתבש. נסו שוב או{" "}
                      <a
                        href="https://wa.me/972YOUR_PHONE?text=היי יוסף, ראיתי את דף Party Time למתחתנים ואני מעוניין/ת לשמוע עוד"
                        className="underline text-gold"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        כתבו ישירות בוואטסאפ
                      </a>
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   SECTION 1 — HERO (upgraded)
───────────────────────────────────────────── */
function HeroSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/wedding.png"
          alt=""
          className="absolute w-full h-full object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to bottom, rgba(18,11,26,0.75) 0%, rgba(18,11,26,0.55) 50%, rgba(18,11,26,0.92) 100%)" }}
      />

      <motion.div
        className="relative z-20 max-w-3xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold mb-8"
          style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}
        >
          ✦ Party Time | למתחתנים ✦
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-serif font-black leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f5f0e8" }}
        >
          תכננתם את הכל.{" "}
          <span className="block mt-1 text-cream-muted" style={{ fontSize: "85%", fontWeight: 600 }}>
            השמלה. הפרחים. התפריט. הצלם.
          </span>
          <span className="block mt-2 gold-shimmer">
            ואז הגיע ריקוד הפתיחה — ופתאום קפאון.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-cream-muted text-lg md:text-xl leading-relaxed mb-4 max-w-xl mx-auto"
        >
          200 אנשים אוהבים יסתכלו עליכם.
          <br />
          השאלה היא — האם תרגישו{" "}
          <span style={{ color: "#D4AF37" }}>חופשיים ברגע הזה</span>,
          <br />
          או תספרו את השניות עד שייגמר?
        </motion.p>

        {/* NEW: expanded promise */}
        <motion.p
          variants={fadeUp}
          className="text-cream-muted/70 text-base mb-10 max-w-lg mx-auto"
          style={{ borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: "1rem" }}
        >
          ולא רק בריקוד הפתיחה —
          <br />
          <span className="text-cream-muted">מזרחית, פופ, 80s, לטיני — כל שיר שיתנגן כל הלילה.</span>
        </motion.p>

        <motion.button
          variants={fadeUp}
          onClick={onCTA}
          className="rounded-full text-lg md:text-xl font-bold px-8 py-5 transition-all animate-pulse-gold"
          style={{ background: "linear-gradient(135deg, #c9963f 0%, #D4AF37 100%)", color: "#120b1a" }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          אני רוצה שזה יהיה הרגע הכי יפה בחתונה שלנו ←
        </motion.button>

        <motion.p variants={fadeUp} className="mt-5 text-sm text-cream-muted/60">
          ✓ ללא התחייבות &nbsp;·&nbsp; ✓ מתאים גם אם לא יודעים לרקוד בכלל &nbsp;·&nbsp; ✓ בלי אלכוהול
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20"
        style={{ translateX: "-50%" }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="text-gold/60 text-3xl">↓</div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2 — PAIN (upgraded: adds music fear)
───────────────────────────────────────────── */
function PainSection() {
  const ref = useRef(null);
  return (
    <section className="section-py section-gradient-top px-4" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            בואו נדבר על האמת
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-8">
            בואו נדבר על מה שבאמת קורה
          </motion.h2>

          <motion.div variants={fadeUp} className="text-right leading-relaxed text-cream-muted text-lg space-y-4 mb-6">
            <p>
              אחד מכם — לרוב החתן — מרגיש שהוא לא יודע לרקוד.
              <br />
              אולי שניכם.
            </p>
            <p>הוא מנסה להרגיע את עצמו כבר שבועות:</p>
          </motion.div>

          <motion.div variants={stagger} className="space-y-3 mb-8">
            {[
              `"נעשה משהו פשוט"`,
              `"אני אשאיר אותה להוביל"`,
              `"בסוף יהיה בסדר"`,
            ].map((quote) => (
              <motion.div key={quote} variants={fadeUp}>
                <div className="quote-text text-right text-lg italic">{quote}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* NEW: the all-night fear */}
          <motion.div
            variants={fadeUp}
            className="glass-card p-6 text-right mt-6"
            style={{ borderColor: "rgba(212,175,55,0.3)" }}
          >
            <p className="text-cream-muted leading-relaxed text-lg">
              ואז? מתחילה מזרחית — ואתם יושבים.
              <br />
              מפעילים 80s — ואתם מחייכים מהצד.
              <br />
              מגיע לטיני — ואתה מציע לה לשתות.
              <br />
              <span className="text-cream-DEFAULT font-semibold block mt-3">
                זה לא רק ריקוד הפתיחה שמפחיד אתכם.
                <br />
                זה כל הלילה.
              </span>
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-cream-DEFAULT text-lg font-semibold">
            הריקוד הזה תופס יותר מקום בראש{" "}
            <span className="gold-shimmer">ממה שאתם מוכנים להודות.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 3 — AGITATION (upgraded: frozen all night)
───────────────────────────────────────────── */
function AgitationSection() {
  return (
    <section className="section-py section-gradient-bottom px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>

          {/* Wedding image — the dream that could be */}
          <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden mb-10" style={{ maxHeight: 340 }}>
            <img
              src="/images/wedding.png"
              alt="זוג רוקד בחתונה"
              className="w-full object-cover object-top"
              style={{ maxHeight: 340 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(18,11,26,0.85) 0%, transparent 60%)" }}
            />
            <p className="absolute bottom-4 right-0 left-0 text-center font-serif text-lg text-cream-DEFAULT px-4">
              ככה זה יכול להיראות בחתונה שלכם.
            </p>
          </motion.div>

          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-8 text-center">
            מאובנים בחתונה שלכם —<br />
            <span className="text-gold">זה לא גזרת גורל.</span>
          </motion.h2>

          <motion.div variants={stagger} className="space-y-5 text-lg text-cream-muted leading-relaxed">
            {[
              { icon: "📸", text: "הצלם יתפוס את הפרצוף שלך כשאתה לא יודע לאן להוריד את הידיים." },
              { icon: "🎵", text: "כל שיר שמתחיל — תסתכלו אחד על השני ולא תדעו מה לעשות. מזרחית, 80s, לטיני — כולם רוקדים, אתם יושבים." },
              { icon: "🥂", text: `"נשתה עוד כוס כדי להשתחרר קצת." — הפתרון הכי שכיח. והכי עצוב.` },
              { icon: "💭", text: "ותסיימו את הלילה עם הרגשה שיכול היה להיות אחרת. שהיה שווה לחגוג יותר." },
            ].map(({ icon, text }) => (
              <motion.div key={icon} variants={fadeUp} className="flex gap-4 items-start glass-card p-5">
                <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
                <p>{text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-center text-cream-muted text-base">
            זה לא כאב גדול.{" "}
            <span className="text-cream-DEFAULT font-semibold">אבל זה לילה שלא חוזר.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4 — SOLUTION (upgraded: broader promise)
───────────────────────────────────────────── */
function SolutionSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-py px-4" style={{ background: "#1e1330" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            הפתרון
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif font-black text-4xl md:text-5xl mb-4">
            <span className="gold-shimmer">Party Time</span>
          </motion.h2>
          <motion.h3 variants={fadeUp} className="font-serif text-2xl md:text-3xl text-cream-DEFAULT mb-10">
            לא ריקוד. <span className="text-gold">שחרור.</span>
          </motion.h3>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-4 text-right mb-12">
            {[
              { label: "לא", value: "כוריאוגרפיה" },
              { label: "לא", value: "ספירת 1-2-3" },
              { label: "לא", value: "אלכוהול כדי להשתחרר" },
            ].map(({ label, value }) => (
              <motion.div key={value} variants={fadeUp} className="glass-card p-5">
                <p className="text-cream-muted text-sm mb-1">{label}</p>
                <p className="text-cream-DEFAULT font-bold text-lg">{value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="text-cream-muted text-lg leading-loose mb-8 text-right">
            <p className="mb-3 text-cream-DEFAULT font-semibold">מה שנעשה?</p>
            <p className="mb-2">נשחרר את הגוף — לכל סגנון, לכל שיר, לכל רגע בלילה.</p>
            <p className="mb-2">נבנה יחד את הסלואו שלכם — שיתאים לכם בדיוק, לא לאף אחד אחר.</p>
            <p className="mb-2">
              נחבר אתכם אחד לשני על הרחבה, כך שכשמגיע כל שיר —{" "}
              <span className="text-cream-DEFAULT font-semibold">תדעו מה לעשות עם הגוף שלכם.</span>
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="font-serif text-2xl text-gold font-bold mb-10">
            "גם ייראה טוב — גם תהנו — גם בלי שיידעו"
          </motion.p>

          {/* couple2 — slow dance visual */}
          <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden mb-10 max-w-md mx-auto">
            <img
              src="/images/couple2.jpg"
              alt="זוג רוקד סלואו"
              className="w-full object-cover rounded-2xl"
              style={{ maxHeight: 360, objectPosition: "center top" }}
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ border: "1px solid rgba(212,175,55,0.4)", background: "linear-gradient(to top, rgba(18,11,26,0.6) 0%, transparent 50%)" }}
            />
            <p className="absolute bottom-4 right-0 left-0 text-center text-sm text-gold font-semibold">
              הסלואו שלכם — מחובר, אמיתי, שלכם
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-10">
            <p className="text-cream-muted text-sm mb-3 text-center">↓ הצצה לקורס הדיגיטלי</p>
            <div className="video-wrapper max-w-xl mx-auto">
              <iframe
                src="https://player.vimeo.com/video/685120888"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="הצצה לקורס Party Time"
              />
            </div>
          </motion.div>

          <motion.button
            variants={fadeUp}
            onClick={onCTA}
            className="rounded-full text-lg font-bold px-8 py-4"
            style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            אני רוצה להרגיש ככה בחתונה שלי ←
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NEW SECTION — MUSIC STYLES
───────────────────────────────────────────── */
const musicStyles = [
  { emoji: "🎻", name: "סלואו", sub: "ריקוד הפתיחה שלכם" },
  { emoji: "🎶", name: "מזרחית", sub: "כולם על הרחבה" },
  { emoji: "🕺", name: "80s", sub: "כיף, קל, חופשי" },
  { emoji: "💃", name: "לטיני", sub: "קצב וחיבור" },
  { emoji: "🎸", name: "ישראלי", sub: "מהלב, בלי מחשבה" },
  { emoji: "🔊", name: "פופ & טרנסים", sub: "אנרגיה, תנועה, הנאה" },
];

function MusicStylesSection() {
  return (
    <section className="section-py px-4" style={{ background: "#120b1a" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 text-center">
            לכל שיר שיתנגן
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-4 text-center">
            לא רק ריקוד פתיחה.
            <br />
            <span className="gold-shimmer">כל הלילה. כל סגנון.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-muted text-center mb-12 max-w-xl mx-auto">
            אתם לא לומדים ריקוד מסוים. אתם לומדים לנוע חופשי בגוף שלכם —
            ואז כל שיר שמגיע, הגוף כבר יודע מה לעשות.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {musicStyles.map((style, i) => (
              <motion.div
                key={style.name}
                variants={fadeUp}
                custom={i}
                className="glass-card p-5 text-center"
                whileHover={{ scale: 1.03, borderColor: "rgba(212,175,55,0.5)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl mb-3">{style.emoji}</div>
                <h3 className="font-serif font-bold text-cream-DEFAULT text-lg mb-1">{style.name}</h3>
                <p className="text-cream-muted text-sm">{style.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* couple.png — energetic party dancing */}
          <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden mt-10">
            <img
              src="/images/couple.png"
              alt="זוג רוקד חופשי במסיבה"
              className="w-full object-cover rounded-2xl"
              style={{ maxHeight: 320, objectPosition: "center 30%" }}
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "linear-gradient(to top, rgba(18,11,26,0.8) 0%, transparent 55%)" }}
            />
            <p className="absolute bottom-5 right-0 left-0 text-center font-serif text-xl text-cream-DEFAULT px-4">
              "כשהגוף חופשי — הרגלים נשכחים. הריקוד פשוט קורה."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 5 — HOW IT WORKS (upgraded)
───────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "שחרור הגוף לכל סגנון",
      desc: "מתחילים מהבסיס — לא צעדים, לא תרגילים. משחררים את מה שמחזיק את הגוף שלכם קפוא. מזרחית, פופ, 80s — הגוף לומד להגיב לכל קצב.",
      icon: "🌊",
    },
    {
      num: "02",
      title: "בניית הסלואו שלכם",
      desc: "בונים יחד ריקוד פתיחה שמרגיש כמוכם — בנוח, אמיתי, מחובר. לא של אף אחד אחר. הסלואו שלכם, עם הרגעים שלכם.",
      icon: "💍",
    },
    {
      num: "03",
      title: "חיבור הזוג על הרחבה",
      desc: "לומדים לנוע ביחד — שהגוף שלכם מדבר אחד עם השני. וזה בדיוק מה שכולם מרגישים מהצד כשהם מסתכלים עליכם.",
      icon: "✨",
    },
    {
      num: "04",
      title: "הרגע שלכם — בלי שיידעו",
      desc: "זה הסוד. כולם יחשבו שאתם פשוט יודעים לרקוד. לא אחד ידע שהייתם בתהליך. הכל ייראה טבעי, זורם, ואמיתי.",
      icon: "🤫",
    },
  ];

  return (
    <section className="section-py px-4" style={{ background: "#1e1330" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-2 text-center">
            איך זה עובד?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-muted text-center mb-12">
            4 שלבים שמשנים הכל
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="glass-card p-7 text-right relative overflow-hidden"
                whileHover={{ borderColor: "rgba(212,175,55,0.6)", transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute top-4 left-4 font-black opacity-10 text-6xl"
                  style={{ color: "#D4AF37", fontFamily: "serif" }}
                >
                  {step.num}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-serif font-bold text-xl text-gold mb-3">{step.title}</h3>
                <p className="text-cream-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NEW SECTION — WEDDING RESULT PREVIEW
───────────────────────────────────────────── */
function WeddingResultSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-py px-4" style={{ background: "#1e1330" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
            התוצאה בפועל
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-4">
            הצצה איך זה נראה
            <br />
            <span className="gold-shimmer">בחתונה אמיתית</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-muted mb-10 max-w-lg mx-auto">
            לא סטודיו. לא תרגול. חתונה אמיתית — זוג שעבר את התהליך, ורוקד ברגע האמיתי.
          </motion.p>

          <motion.div variants={fadeUp} className="video-wrapper max-w-2xl mx-auto"
            style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(212,175,55,0.35)",
              boxShadow: "0 0 40px rgba(212,175,55,0.12)" }}>
            <iframe
              src="https://player.vimeo.com/video/412297335"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="תוצאות Party Time בחתונה אמיתית"
            />
          </motion.div>

          <motion.button
            variants={fadeUp}
            onClick={onCTA}
            className="mt-10 rounded-full text-lg font-bold px-8 py-4"
            style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            אני רוצה שזה יהיה הריקוד שלנו ←
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NEW SECTION — THE SECRET
───────────────────────────────────────────── */
function TheSecretSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-py px-4 relative overflow-hidden" style={{ background: "#120b1a" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold mb-8"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37" }}
          >
            🤫 הסוד שלכם
          </motion.div>

          <motion.h2 variants={fadeUp} className="font-serif font-black text-3xl md:text-5xl text-cream-DEFAULT leading-tight mb-8">
            איש לא ידע.
            <br />
            <span className="gold-shimmer">הכל ייראה טבעי.</span>
          </motion.h2>

          <motion.div variants={stagger} className="space-y-4 mb-10">
            {[
              { icon: "🙅", text: "לא צריך אלכוהול כדי להשתחרר — השחרור הוא אמיתי, מהגוף." },
              { icon: "👀", text: "אף אחד לא ידע שהייתם בתהליך. לא חבר, לא הורה, לא מישהו בחתונה." },
              { icon: "✅", text: "זה ייראה כאילו תמיד ידעתם לרקוד — כי הגוף שלכם ילמד לנוע ממקום אמיתי." },
              { icon: "🎉", text: "גם ייראה טוב — גם תהנו. שניהם. באותו לילה. בלי להתפשר על אף אחד." },
            ].map(({ icon, text }) => (
              <motion.div
                key={icon}
                variants={fadeUp}
                className="glass-card p-5 flex gap-4 items-start text-right"
              >
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <p className="text-cream-muted leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* joseph.jpg — the freedom visual */}
          <motion.div variants={fadeUp} className="relative rounded-full overflow-hidden mx-auto mb-8" style={{ width: 200, height: 200 }}>
            <img
              src="/images/joseph.jpg"
              alt="חופשי על הרחבה"
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(212,175,55,0.5)" }}
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-serif text-xl md:text-2xl text-cream-DEFAULT font-bold mb-8 leading-relaxed"
          >
            זה לא ריקוד שלמדתם.
            <br />
            <span className="text-gold">זה מי שאתם — כשאתם משוחררים.</span>
          </motion.p>

          <motion.button
            variants={fadeUp}
            onClick={onCTA}
            className="rounded-full text-lg font-bold px-8 py-4"
            style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            אני רוצה את הסוד הזה ←
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 6A — TEXT TESTIMONIALS
───────────────────────────────────────────── */
function TextTestimonialsSection() {
  const testimonials = [
    {
      quote: "הגענו כשאחד מאיתנו כבר חרד מהמחשבה על הריקוד. יצאנו עם ריקוד שגרם לאורחים לבכות מרגש. זה היה הרגע הכי יפה בחתונה.",
      name: "מיכל ועמית",
      emoji: "💑",
    },
    {
      quote: "לא האמנתי שאני יכול לרקוד. ממש לא. יוסף לא לימד אותי צעדים — הוא שחרר אותי. בחתונה שלנו רקדתי בלי לחשוב על כלום.",
      name: "דניאל, חתן",
      emoji: "🕺",
    },
    {
      quote: "המורה לריקוד הקודמת שלנו גרמה לי להרגיש יותר מגושמת. יוסף גרם לי להרגיש שאני פשוט... אני. וזה עבד.",
      name: "שירה, כלה",
      emoji: "👰",
    },
  ];

  return (
    <section className="section-py px-4" style={{ background: "#1e1330" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-10 text-center">
            מה אמרו זוגות אחרים?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="glass-card p-6 flex flex-col gap-4">
                <div className="text-3xl">{t.emoji}</div>
                <p className="text-cream-muted italic leading-relaxed text-right flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="gold-divider" />
                <p className="text-gold font-semibold text-right text-sm">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 6B — VIDEO TESTIMONIALS
───────────────────────────────────────────── */
const vimeoTestimonials = [
  { id: "936641367", title: "עדות 1" },
  { id: "925087288", title: "עדות 2" },
  { id: "911813704", title: "עדות 3" },
];

const youtubeShorts = [
  { id: "lrzp9sOfX9c", title: "עדות 4" },
  { id: "5FeL-xoGiRs", title: "עדות 5" },
  { id: "i4zqwplsDwY", title: "עדות 6" },
  { id: "4gT3M4YBd4w", title: "עדות 7" },
];

function VideoTestimonialsSection() {
  return (
    <section className="section-py px-4" style={{ background: "#120b1a" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-2 text-center">
            תראו בעצמכם מה קורה כשמשתחררים
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-muted text-center mb-10">
            לא סיפורים. אנשים אמיתיים.
          </motion.p>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-5 mb-8">
            {vimeoTestimonials.map(({ id, title }) => (
              <motion.div key={id} variants={fadeUp}>
                <div
                  className="video-wrapper"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, overflow: "hidden" }}
                >
                  <iframe
                    src={`https://player.vimeo.com/video/${id}`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={title}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {youtubeShorts.map(({ id, title }) => (
              <motion.div key={id} variants={fadeUp}>
                <div
                  className="shorts-wrapper"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, overflow: "hidden" }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 7 — PACKAGES
───────────────────────────────────────────── */
const packages = [
  {
    name: "דיגיטלי",
    price: "197",
    tagline: "להתחיל לבד, בקצב שלכם",
    features: [
      "קורס וידאו מלא לשחרור ברחבה",
      "שחרור לכל סגנון מוזיקה",
      "גישה מיידית ולצמיתות",
    ],
    cta: "אני רוצה את זה ←",
    featured: false,
    checkoutUrl: "/checkout/digital",
  },
  {
    name: "דיגיטלי + שיעור פרטי",
    price: "970",
    tagline: "קורס + מגע אישי",
    features: [
      "קורס דיגיטלי מלא",
      "שיעור פרטי אחד עם יוסף",
      "מותאם לכם כזוג",
    ],
    cta: "בואו נתחיל ←",
    featured: false,
    checkoutUrl: "/checkout/basic",
  },
  {
    name: "דיגיטלי + 2 שיעורים",
    price: "1,500",
    tagline: "כשרוצים לבוא מוכנים",
    features: [
      "קורס דיגיטלי מלא",
      "2 שיעורים פרטיים עם יוסף",
      "זמן אמיתי לבנות יחד את הריקוד",
    ],
    cta: "זה המסלול שלנו ←",
    featured: false,
    checkoutUrl: "/checkout/standard",
  },
  {
    name: "החבילה המלאה",
    price: "2,600",
    tagline: "מהפחד — לריקוד שיזכרו",
    features: [
      "קורס דיגיטלי מלא",
      "4 מפגשים פרטיים עם יוסף",
      "הרכבת ריקוד הסלואו המלא שלכם",
      "שחרור לכל סגנון — כל הלילה",
      "ליווי וואטסאפ 30 יום לתרגול",
      "נכנסים לחתונה מוכנים ומשוחררים",
    ],
    cta: "אני רוצה את הריקוד המלא ←",
    featured: true,
    badge: "⭐ הכי פופולרי",
    checkoutUrl: "/checkout/full",
  },
];

function PackagesSection() {
  return (
    <section className="section-py px-4" style={{ background: "#1e1330" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-2 text-center">
            בחרו את המסלול שמתאים לכם
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-muted text-center mb-8">
            כל מסלול מוביל לאותו מקום — רחבה, חופשיים, ביחד
          </motion.p>

          {/* digital.png — course mockup */}
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="relative">
              <img
                src="/images/digital.png"
                alt="קורס Party Time הדיגיטלי"
                className="rounded-2xl object-cover"
                style={{ maxHeight: 220, maxWidth: 340 }}
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "1px solid rgba(212,175,55,0.3)" }}
              />
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                className={`flex flex-col p-6 h-full relative ${pkg.featured ? "glass-card-featured" : "glass-card"}`}
              >
                {pkg.badge && (
                  <div
                    className="absolute -top-3 right-1/2 translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
                  >
                    {pkg.badge}
                  </div>
                )}

                <p className={`text-sm font-semibold mb-1 ${pkg.featured ? "text-gold" : "text-cream-muted"}`}>
                  {pkg.tagline}
                </p>
                <h3 className="font-serif font-bold text-cream-DEFAULT text-lg mb-3">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="font-black text-3xl text-cream-DEFAULT">{pkg.price}</span>
                  <span className="text-cream-muted text-sm mr-1">₪</span>
                </div>

                <ul className="space-y-2 flex-1 mb-6 text-right">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start text-sm text-cream-muted">
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={pkg.checkoutUrl}
                  className="w-full rounded-xl py-3 font-bold text-sm block text-center"
                  style={
                    pkg.featured
                      ? { background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }
                      : { background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }
                  }
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {pkg.cta}
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 8 — AUTHORITY
───────────────────────────────────────────── */
function AuthoritySection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-py px-4" style={{ background: "#120b1a" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.p variants={fadeUp} className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 text-center">
            מי מלווה אתכם
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif font-bold text-3xl md:text-4xl text-cream-DEFAULT mb-10 text-center">
            מי זה יוסף אלון?
          </motion.h2>

          <motion.div variants={fadeUp} className="glass-card p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Joseph photo + stats */}
              <div className="flex flex-col items-center gap-5 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ width: 160, height: 180 }}>
                  <img
                    src="/images/joseph.jpg"
                    alt="יוסף אלון"
                    className="w-full h-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ border: "2px solid rgba(212,175,55,0.4)" }}
                  />
                </div>
                <div className="flex md:flex-col gap-6 text-center">
                  {[
                    { num: "14", label: "שנות ניסיון" },
                    { num: "מאות", label: "זוגות ולקוחות" },
                  ].map(({ num, label }) => (
                    <div key={label}>
                      <div className="font-serif font-black text-3xl text-gold">{num}</div>
                      <div className="text-cream-muted text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden md:block w-px self-stretch" style={{ background: "rgba(212,175,55,0.3)" }} />

              <div className="text-right space-y-4 text-cream-muted leading-relaxed">
                <p>
                  יוסף אלון הוא מייסד{" "}
                  <span className="text-cream-DEFAULT font-semibold">Passion For Action</span> —
                  המרכז להעצמה אישית דרך תנועה.
                </p>
                <p>
                  הוא לא מלמד ריקוד. הוא משנה את האופן שבו אנשים מרגישים בגוף שלהם — על הרחבה, בכל סגנון, בכל שיר.
                </p>
                <p>
                  המתודולוגיה שלו,{" "}
                  <span className="text-gold italic">&ldquo;תנועה יוצרת מציאות&rdquo;</span>,
                  מבוססת על שנים של עבודה עם אנשים שאמרו בדיוק מה שאתם אומרים עכשיו:
                </p>
                <p className="quote-text text-lg font-semibold text-cream-DEFAULT">
                  &ldquo;אני לא יודע לרקוד.&rdquo;
                </p>
                <p className="text-cream-DEFAULT font-medium">
                  הם לא לא ידעו לרקוד.
                  <br />
                  הם פשוט עוד לא שוחררו.
                </p>
              </div>
            </div>
          </motion.div>

          {/* tv.jpg — media credibility */}
          <motion.div variants={fadeUp} className="mt-6">
            <p className="text-cream-muted text-xs text-center mb-3 tracking-widest uppercase">כפי שהוצג ב</p>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/images/tv.jpg"
                alt="יוסף אלון בתקשורת — רשת, קשת, ערוץ 14, 102FM"
                className="w-full object-cover rounded-2xl"
                style={{ maxHeight: 260, objectPosition: "center top" }}
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "1px solid rgba(212,175,55,0.25)", background: "rgba(18,11,26,0.15)" }}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <button
              onClick={onCTA}
              className="text-gold underline underline-offset-4 hover:text-gold-light transition-colors text-sm"
            >
              דברו עם יוסף ישירות ←
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 9 — FINAL CTA (upgraded)
───────────────────────────────────────────── */
function FinalCTASection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-py px-4 relative overflow-hidden" style={{ background: "#1e1330" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <motion.h2 variants={fadeUp} className="font-serif font-black text-3xl md:text-5xl text-cream-DEFAULT leading-tight mb-6">
            החתונה שלכם מגיעה.
            <br />
            <span className="gold-shimmer">הריקוד לא חייב להיות הרגע שאתם חוששים ממנו.</span>
          </motion.h2>

          <motion.div variants={fadeUp} className="text-cream-muted text-lg leading-loose mb-10 space-y-2">
            <p>הוא יכול להיות הרגע שתספרו עליו שנים.</p>
            <p>מזרחית, 80s, סלואו, לטיני — כל שיר שיתנגן, תדעו מה לעשות.</p>
            <p>בלי אלכוהול. בלי ספירות. בלי לחץ.</p>
            <p>200 אנשים אוהבים יסתכלו עליכם.</p>
            <p>תרגישו חופשיים.</p>
            <p>תהיו שם — אחד עם השני.</p>
            <p className="text-cream-DEFAULT font-bold text-xl mt-2">ותרקדו.</p>
          </motion.div>

          <motion.button
            variants={fadeUp}
            onClick={onCTA}
            className="rounded-full text-xl font-black px-10 py-5 mb-4 animate-pulse-gold"
            style={{ background: "linear-gradient(135deg, #c9963f 0%, #D4AF37 100%)", color: "#120b1a" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            אני רוצה את הרגע הזה — קבע שיחה עם יוסף ←
          </motion.button>

          <motion.p variants={fadeUp} className="text-cream-muted/60 text-sm">
            ללא התחייבות — שיחה קצרה כדי להבין מה מתאים לכם
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="py-8 px-4 text-center text-cream-muted/40 text-sm"
      style={{ background: "#0d081a", borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      <p>© {new Date().getFullYear()} Passion For Action | יוסף אלון</p>
      <p className="mt-1">תנועה יוצרת מציאות</p>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   STICKY NAV
───────────────────────────────────────────── */
function StickyNav({ onCTA }: { onCTA: () => void }) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
      style={{ background: "rgba(18,11,26,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <span className="font-serif font-bold text-gold text-sm">Passion For Action</span>
      <button
        onClick={onCTA}
        className="rounded-full px-5 py-2 text-sm font-bold"
        style={{ background: "linear-gradient(135deg, #c9963f, #D4AF37)", color: "#120b1a" }}
      >
        קבע שיחה ←
      </button>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();

  const openModal = (pkg?: string) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  return (
    <>
      <StickyNav onCTA={() => openModal()} />

      <main className="pt-14">
        <HeroSection onCTA={() => openModal()} />

        <div className="gold-divider" />
        <PainSection />

        <div className="gold-divider" />
        <AgitationSection />

        <div className="gold-divider" />
        <SolutionSection onCTA={() => openModal()} />

        <div className="gold-divider" />
        <MusicStylesSection />

        <div className="gold-divider" />
        <HowItWorksSection />

        <div className="gold-divider" />
        <WeddingResultSection onCTA={() => openModal()} />

        <div className="gold-divider" />
        <TheSecretSection onCTA={() => openModal()} />

        <div className="gold-divider" />
        <TextTestimonialsSection />

        <div className="gold-divider" />
        <VideoTestimonialsSection />

        <div className="gold-divider" />
        <PackagesSection />

        <div className="gold-divider" />
        <AuthoritySection onCTA={() => openModal()} />

        <div className="gold-divider" />
        <FinalCTASection onCTA={() => openModal()} />

        <Footer />
      </main>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageLabel={selectedPackage}
      />
    </>
  );
}
