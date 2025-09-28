# 📑 AI CV Evaluator Backend

Backend service untuk **mini project backend**: evaluasi CV & Project Report kandidat menggunakan **DeepSeek API** + pipeline AI. Dibangun dengan **Node.js + TypeScript + Express**.

---

## ✨ Features
- Upload **CV/Project Report** (`PDF` atau `DOCX`) → parsing jadi teks.
- Evaluasi otomatis dengan **DeepSeek API**:
  - Extract structured data (skills, pengalaman, projects).
  - Hitung **CV Match Rate** vs job description.
  - Scoring **Project Deliverable** berdasarkan rubric.
- **Async Job Handling**:
  - `POST /evaluate` → return job ID.
  - `GET /result/:id` → ambil hasil evaluasi.
- **Scalar API Docs** di `/docs`.
- **Logging** request dengan **morgan**.
- Modular, strict typed (**TypeScript**).

---

## 📂 Project Structure
```

src/
├─ app.ts           # inisialisasi express + middleware
├─ server.ts        # entry point
├─ routes/          # API endpoints
│   ├─ upload.ts    # upload file (CV/Docx)
│   ├─ evaluate.ts  # evaluasi AI
│   ├─ result.ts    # ambil hasil evaluasi
│   └─ index.ts
├─ services/        # business logic
│   ├─ parser.ts    # parsing PDF (pdfjs-dist) & DOCX (mammoth)
│   ├─ deepseek.ts  # call DeepSeek API
│   ├─ tasks.ts     # async job storage
│   └─ rag.ts       # dummy retrieval (RAG-ready)
└─ docs/
└─ openapi.json # OpenAPI spec untuk Scalar Docs

````

---

## ⚙️ Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourname/api-cv-evaluate.git
cd api-cv-evaluate
pnpm install
````

### 2. Buat file `.env`

```env
PORT=3000
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### 3. Jalankan server

```bash
pnpm dev
```

Server jalan di:

* API: [http://localhost:3000](http://localhost:3000)
* Docs: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🔗 API Endpoints

### `POST /upload`

Upload file CV/Project (PDF/DOCX).
**Body**: `multipart/form-data` → `file`

**Response:**

```json
{
  "status": "ok",
  "textPreview": "John Doe, Backend Engineer...",
  "fullText": "..."
}
```

---

### `POST /evaluate`

Mulai evaluasi (async).
**Body**:

```json
{
  "cvText": "....",
  "jobDescription": "Backend engineer with Node.js..."
}
```

**Response:**

```json
{
  "id": "uuid",
  "status": "queued"
}
```

---

### `GET /result/:id`

Ambil hasil evaluasi.

**Response (completed):**

```json
{
  "status": "completed",
  "result": {
    "cv_match_rate": 0.82,
    "cv_feedback": "Strong backend/cloud, limited AI exp.",
    "project_score": 7.5,
    "project_feedback": "Meets chaining reqs, lacks error handling.",
    "overall_summary": "Good fit, needs more RAG knowledge."
  }
}
```

---

## 🛠️ Tools & Tech

* [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
* [DeepSeek API](https://platform.deepseek.com/)
* [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) (PDF parsing)
* [mammoth](https://www.npmjs.com/package/mammoth) (DOCX parsing)
* [morgan](https://www.npmjs.com/package/morgan) (logging)
* [Scalar](https://scalar.com/) (API Reference Docs)

---

## 🧪 Future Improvements

* Implement real **vector DB (RAG)**.
* Add **OCR fallback** (Tesseract.js) untuk PDF hasil scan.
* Store tasks di DB (Redis/SQLite) bukan in-memory.
* CI/CD pipeline + test coverage.

---

## 👨‍💻 Author

* Ahmad Shaleh (@ahmadsaleh2409)