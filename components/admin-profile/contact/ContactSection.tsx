"use client";

import type { Contact } from "../types";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface ContactSectionProps {
  contact: Contact;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" style={{ ...section, padding: "100px 16px", position: "relative" }}>
      <div style={{ position: "absolute", width: 450, height: 450, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(108,99,255,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <SectionLabel label="// CONTACT" />
        <h2 style={{ ...h2, fontSize: "clamp(30px,6vw,60px)" }}>Let's <span className="shimmer-text">Build</span> Together</h2>
        <p style={{ color: "#9CA3AF", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", marginBottom: 40, marginTop: 8 }}>
          Open to full-time · freelance · open-source
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <a href={`mailto:${contact.email}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 14, fontWeight: 700, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#6C63FF,#A855F7)", boxShadow: "0 8px 30px rgba(108,99,255,0.42)", textDecoration: "none", fontFamily: "'Syne',sans-serif" }}>✉ Send Email</a>
          <a href={contact.github} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 14, fontWeight: 700, fontSize: 13, color: "#fff", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none", fontFamily: "'Syne',sans-serif" }}>⌥ GitHub</a>
        </div>
      </div>
    </section>
  );
}
