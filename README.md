# JobFlow

An AI-powered job application tracker with resume analysis, ATS scoring, and application management.

## Features

- 📄 **Resume Analysis** — Upload a resume and get AI-driven feedback
- 🎯 **ATS Scoring** — See how well your resume matches job requirements
- 📊 **Skill Matching** — Identify skill gaps against target roles
- 📋 **Application Tracking** — Keep tabs on where you've applied and your progress

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Frontend | Vanilla JavaScript, HTML |
| AI | Groq API (LLaMA 3.3 70B) |
| PDF Parsing | pdfjs-dist |

## Getting Started

### Prerequisites
- Node.js installed
- A Groq API key ([get one here](https://console.groq.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/kashish-005/JobFlow.git
cd JobFlow

# Install backend dependencies
cd backend
npm install

# Add your API key
echo "GROQ_API_KEY=your_key_here" > .env

# Start the server
node server.js
```

Then open `index.html` in your browser.

## How It Works

1. Upload your resume (PDF)
2. The backend extracts text from the PDF and sends it to the Groq API
3. Get back ATS compatibility score, skill match analysis, and improvement suggestions

## Project Status

🚧 In active development — built as a personal project to explore AI-assisted tooling for the job search process.

## Author

**Kashish Gothwal**
CSE Student @ IGDTUW
