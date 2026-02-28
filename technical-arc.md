# 🚀 AI Portfolio SaaS

An AI-powered Portfolio SaaS platform that automatically generates a professional portfolio website from a user's resume and custom prompt.

---

## 🧠 Overview

This platform allows users to:

1. Upload their resume (PDF / DOCX)
2. Provide a customization prompt (e.g., "Dark theme, modern, frontend developer")
3. Automatically generate a complete portfolio website

The system extracts resume data, structures it using AI, maps it to predefined templates, and publishes a live portfolio.

---

## 🏗️ System Architecture

### 🔹 1. Resume Upload Layer
- Accepts PDF / DOCX files
- Stores files in cloud storage (S3 / Cloudinary)
- Saves file metadata in database

### 🔹 2. Resume Parsing Layer
- Extracts text from resume
- Uses OCR if scanned
- Converts raw text into structured JSON format

Example structured format:

```json
{
  "name": "Rahul Kumar",
  "skills": ["React", "Node.js", "MongoDB"],
  "projects": [],
  "experience": [],
  "education": [],
  "contact": {}
}
```

---

### 🔹 3. AI Processing Layer

AI receives:
- Structured resume JSON
- User customization prompt

AI generates:
- Hero section content
- About section
- Improved project descriptions
- SEO summary
- Tagline
- Skills summary

> AI generates content only.  
> Templates and layout are controlled by the backend.

---

### 🔹 4. Template Engine

- Predefined portfolio templates
- Content injected dynamically
- No AI-generated raw HTML (security reasons)
- Template selected based on user prompt

Example route:
```
/[username]
```

---

### 🔹 5. Multi-Tenant SaaS Architecture

- Each user has isolated portfolio data
- Shared database with tenant-based isolation
- Dynamic rendering using stored structured data
- Billing & regeneration limits supported

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** Prisma + PostgreSQL / MongoDB
- **Storage:** Cloudinary / AWS S3
- **AI Engine:** OpenAI GPT
- **Authentication:** JWT / NextAuth
- **Deployment:** Vercel / Cloud Platform

---

## 🔐 Security Considerations

- No direct user database connections
- No AI-generated raw executable HTML
- Sanitized resume input
- Rate limiting on AI generation
- File validation before parsing

---

## 💰 Monetization Model

- Free: 1 portfolio generation
- Paid: Unlimited regeneration
- Premium: Custom domains, advanced templates, analytics

---

## 📂 Project Structure (High-Level)

```
/app
  /(auth)
  /dashboard
  /templates
  /api
  /[username]
/components
/lib
/services
/prisma
/middleware.ts
```

---

## 🔄 Generation Flow

1. User uploads resume
2. System parses resume
3. Structured JSON created
4. AI enhances content
5. Template selected
6. Portfolio generated
7. Live route created

---

## 🚀 Future Improvements

- GitHub auto-import
- LinkedIn integration
- ATS score analyzer
- AI resume improvement suggestions
- Career growth recommendations
- Portfolio analytics dashboard

---

## 🎯 Design Philosophy

- Controlled template rendering
- Structured data first
- AI for content, not layout
- Scalable multi-tenant architecture
- Cost-efficient AI usage

---

## 📌 Key Principle

AI generates content.  
The system controls structure, rendering, and security.

---

Built with ❤️ to simplify portfolio creation.