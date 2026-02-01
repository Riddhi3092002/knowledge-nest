# 🎓 Knowledge Nest: Personalized Learning Platform

Knowledge Nest is a full-stack educational ecosystem that bridges the gap between massive course repositories and active, AI-assisted learning. It enables users to manage their learning journey through a searchable database of **8,000+ Coursera courses**, persistent progress tracking, and an integrated AI tutor.

**🔗 [View Live Project](https://theknowledgenest.netlify.app/)**

---

## 🚀 Key Features

### Course Discovery & Management
* **Massive Repository:** Search through 8,000+ courses (Kaggle dataset) filtered by field.
* **Progress Dashboard:** Track "In-Progress" vs. "Completed" courses with a dedicated management tab.
* **Granular Tracking:** Check off weekly modules, which automatically updates completion percentages and timestamps your progress.
* **Personal Notes:** Add custom comments and insights to any course in your list.

### AI-Powered Study Tools (via Groq API)
* **Smart Summarizer:** Upload PDFs or paste text to generate concise summaries in under **7 seconds**.
* **Contextual Quiz Generation:** Quizzes are dynamically generated based on the specific skills from the user's active/completed courses—ensuring the AI tutor stays relevant to your actual studies.
* **Auto-Grading:** Instant evaluation of AI-generated quizzes to validate learning retention.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular, RxJS, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | MongoDB |
| **AI Engine** | Groq API (LLM Processing) |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Netlify, Render|

---

## System Architecture



The platform follows a modern decoupled architecture:

1.  **Client Layer:** An Angular SPA provides a reactive UI, managing state for course progress and document uploads.
2.  **API Layer:** FastAPI handles high-performance routing, JWT authentication, and communication with the AI engine.
3.  **Data Layer:** MongoDB stores the Coursera dataset, user-specific progress logs, and skill-mappings.
4.  **AI Integration:** The backend pipes user skills or document text to the Groq API, processing LLM responses into structured JSON for the frontend to render.

---

## 💡 Why This Project?
Traditional platforms often lead to "tutorial hell." **Knowledge Nest** solves this by:
* Providing a **centralized hub** for external Coursera content.
* Ensuring AI tools are **context-aware**—the quiz system knows what you’ve studied, so it asks the right questions.
* Optimizing for **performance**, delivering LLM insights in a fraction of the time of standard providers.

---

## 📸 Project Preview

> **Note:** Images are scaled for readability. Click any image to view the full 1280x720 resolution.

### 1. Login & Dashboard
<a href="screenshots/Login%20%26%20Dashboard.gif">
  <img src="screenshots/Login%20%26%20Dashboard.gif" width="600" alt="Login and Dashboard">
</a>

---

### 2. My Courses
<a href="screenshots/MyCourses.gif">
  <img src="screenshots/MyCourses.gif" width="600" alt="My Courses">
</a>

---

### 3. Progress Tracking
<a href="screenshots/Progress%20Tracking.gif">
  <img src="screenshots/Progress%20Tracking.gif" width="600" alt="Progress Tracking">
</a>

---

### 4. AI Summarization
<a href="screenshots/Progress%20Tracking.gif">
  <img src="screenshots/Progress%20Tracking.gif" width="600" alt="Summarize">
</a>

---

### 5. AI Quiz Generator
<a href="screenshots/Quiz.gif">
  <img src="screenshots/Quiz.gif" width="600" alt="Quiz Generator">
</a>
