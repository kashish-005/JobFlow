import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import Groq from 'groq-sdk';

const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');
const pdfParse = typeof pdfParseLib === 'function' ? pdfParseLib : pdfParseLib.default;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let resumeText = '';

    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const mime = req.file.mimetype;

    if (mime === 'application/pdf') {
      try {
        const d = await pdfParse(req.file.buffer);
        resumeText = d.text?.trim();
        if (!resumeText || resumeText.length < 50) {
          return res.status(400).json({ error: 'Could not extract text from this PDF. Please upload TXT or DOCX instead.' });
        }
      } catch(e) {
        return res.status(400).json({ error: 'PDF parsing failed. Please upload TXT or DOCX instead.' });
      }

    } else if (mime.includes('wordprocessingml') || mime.includes('msword')) {
      const p = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = p.value;

    } else {
      resumeText = req.file.buffer.toString('utf-8');
    }

    const text = resumeText.slice(0, 3000);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a resume analyzer. Always respond with valid JSON only. No markdown, no explanation.' },
        { role: 'user', content: `Analyze this resume and return JSON with keys: atsScore (number 0-100), detectedRole (string), skillMatchPercentage (null), summary (string), strengths (array of 3 strings), weaknesses (array of 3 strings), missingSkills (array of 3 strings), suggestions (array of 3 strings), suggestedRoles (array of 3 strings).\n\nResume:\n${text}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1
    });

    const raw = completion.choices[0].message.content;
    console.log('Raw response:', raw.slice(0, 200));

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response: ' + raw.slice(0, 100));

    const analysisData = JSON.parse(jsonMatch[0]);
    console.log('Done! ATS Score:', analysisData.atsScore);
    return res.status(200).json(analysisData);

  } catch (err) {
    console.error('Analysis error:', err.message);
    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

export default router;