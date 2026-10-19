const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
   apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
   type: Type.OBJECT,
   properties: {
      matchScore: { type: Type.NUMBER },
      technicalQuestions: {
         type: Type.ARRAY,
         items: {
            type: Type.OBJECT,
            properties: {
               question: { type: Type.STRING },
               intention: { type: Type.STRING },
               answer: { type: Type.STRING },
            },
            required: ["question", "intention", "answer"],
         },
      },
      behavioralQuestions: {
         type: Type.ARRAY,
         items: {
            type: Type.OBJECT,
            properties: {
               question: { type: Type.STRING },
               intention: { type: Type.STRING },
               answer: { type: Type.STRING },
            },
            required: ["question", "intention", "answer"],
         },
      },
      skillGaps: {
         type: Type.ARRAY,
         items: {
            type: Type.OBJECT,
            properties: {
               skill: { type: Type.STRING },
               severity: {
                  type: Type.STRING,
                  enum: ["low", "medium", "high"],
               },
            },
            required: ["skill", "severity"],
         },
      },
      preparationPlan: {
         type: Type.ARRAY,
         items: {
            type: Type.OBJECT,
            properties: {
               day: { type: Type.NUMBER },
               focus: { type: Type.STRING },
               tasks: { type: Type.STRING },
            },
            required: ["day", "focus", "tasks"],
         },
      },
      title: { type: Type.STRING },

   },
   required: [
      "title",
      "matchScore",
      "technicalQuestions",
      "behavioralQuestions",
      "skillGaps",
      "preparationPlan",
   ],
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
   const prompt = `Generate a detailed interview preparation report based on the candidate's resume, self-description, and job description.

Resume: ${resume}
Self-description: ${selfDescription}
Job description: ${jobDescription}
Follow these requirements strictly:
1. title: Return the job title for which the candidate is preparing,
   based on the provided job description.

2. matchScore: Return a number between 0 and 100.

3. technicalQuestions: Return an array of 5 objects. Each object must contain:
- question: A technical interview question.
- intention: What the interviewer wants to evaluate.
- answer: A sample answer explaining the key points.

4. behavioralQuestions: Return an array of 5 objects. Each object must contain:
- question: A behavioral interview question.
- intention: What the interviewer wants to evaluate.
- answer: A sample answer based on the candidate's background. Do not invent specific experiences.

5. skillGaps: Return an array of objects. Each object must contain:
- skill: A skill the candidate needs to improve based on the resume and job description.
- severity: Exactly "low", "medium", or "high".

6. preparationPlan: Return an array of 7 objects. Each object must contain:
- day: A number from 1 to 7.
- focus: The main topic for that day.
- tasks: Specific preparation tasks for that day.

IMPORTANT:
- Return valid JSON matching the response schema.
- Every array item must be an object, never a plain string.
- Use the exact field names specified above.
- Do not omit any required fields.
- Do not include Markdown, explanations, or text outside the JSON response.
`
   const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `${prompt}
      For every technical and behavioral question:
- Write a specific, detailed sample answer.
- Explain the concepts clearly.
- Use the candidate's actual resume and project experience where relevant.
- Never use placeholder answers or generic instructions.
- Never claim the candidate used a specific tool, solved a specific bug, or achieved a specific result unless the resume or self-description confirms it.
- If the candidate's actual experience is unknown, provide an honest sample answer that the candidate can customize.

For every preparation-plan day:
- Make focus a short topic title.
- Make tasks specific actionable steps, not a copy of focus.
`,
      config: {
         responseMimeType: "application/json",
         responseSchema: interviewReportSchema
      }
   })
   return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
   
   const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });

   try {
      const page = await browser.newPage();

      await page.setContent(htmlContent, {
         waitUntil: "networkidle0",
      });
      await page.addStyleTag({
         
content: `
  @page {
    size: A4;
    margin: 10mm 11mm;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    font-family: Arial, Helvetica, sans-serif !important;
    color: #222 !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  }

  body {
    width: 100% !important;
  }

  h1 {
    font-size: 20px !important;
  margin: 0 0 8px !important;
    line-height: 1.2 !important;
  }

  h2 {
   
     font-size: 11px !important;
  margin: 10px 0 5px !important;
    line-height: 1.25 !important;
  }

  h3 {
    font-size: 10.5px !important;
    line-height: 1.25 !important;
    margin: 6px 0 3px !important;
  }

  p, li {
    font-size: 11px !important;
    margin-top: 3px !important;
  margin-bottom: 4px !important;
  line-height: 1.4 !important;
    margin-top: 2px !important;
  }

  ul, ol {
    padding-left: 16px !important;
    margin-top: 4px !important;
    margin-bottom: 6px !important;
  }

  section {
    margin-bottom: 10px !important;
  }

  hr {
    margin: 6px 0 !important;
  }

  * {
    box-sizing: border-box;
  }
`,

      });
      const pdfBuffer = await page.pdf({
         format: "A4",
  preferCSSPageSize: true,
  printBackground: true,
  margin: {
    top: "10mm",
    bottom: "10mm",
    left: "10mm",
    right: "10mm",
  },
      });

      return pdfBuffer;
   }
   catch (err) {
      console.log(err)
   } finally {
      await browser.close();
   }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
   const resumePdfSchema = {
      type: Type.OBJECT,
      properties: {
         html: {
            type: Type.STRING,
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
         }
      },
      required: ["html"]
   };
   
const prompt = `
You are a professional resume designer and ATS-friendly resume writer.

Create a polished, professional, human-written resume using the candidate's
original resume, self-description, and the target job description.

CANDIDATE INFORMATION:
Resume: ${resume}
Self-description: ${selfDescription}
Job description: ${jobDescription}

CONTENT REQUIREMENTS:
1. Preserve the candidate's real name, contact details, education, employers,
   job titles, dates, skills, projects, and relevant achievements.
2. Tailor the summary, skills, and bullet points to the target job description
   without changing factual information.
3. Use concise but meaningful bullet points that explain responsibilities,
   technologies, contributions, and verified outcomes.
4. Do not invent metrics, achievements, experience, qualifications, or tools.
5. Keep all relevant sections, including Professional Summary, Technical Skills,
   Experience, Projects, and Education, when supported by the source material.
6. Correct grammar and improve clarity without exaggerating the candidate's level.
7. Use a single-column layout with standard section headings for ATS compatibility.

PAGE AND LAYOUT REQUIREMENTS:
1. The final resume must fit on exactly ONE A4 page.
2. Use the printable page area efficiently, with balanced top-to-bottom spacing.
3. Do not compress all content into only the upper half of the page when
   additional readable spacing can improve the layout.
4. Use approximately 10–11px body text, 11–13px section headings, and
   20–24px for the candidate's name, adjusting slightly if needed to fit one page.
5. Use line-height around 1.35–1.45 for body text.
6. Give each section clear separation with consistent vertical spacing.
7. Keep bullet points readable, with modest indentation and spacing.
8. Use balanced margins of approximately 10–14mm.
9. Avoid excessive whitespace between individual bullet points, but do not
   make the overall resume cramped or difficult to read.
10. Do not use fixed-height containers, large empty blocks, unnecessary
    page-break rules, or CSS transforms that shrink the entire resume.
11. Do not stretch content artificially or add empty sections merely to fill space.
12. If content is too long, prioritize concise wording while preserving important
    factual information. Never shrink the text to an unreadable size.
13. Use restrained professional colors, clear typography, and subtle dividers.
14. Include no photographs, decorative graphics, tables, or multiple columns.

HTML REQUIREMENTS:
- Return complete HTML with CSS inside a <style> tag.
- Use semantic HTML such as h1, h2, section, p, ul, and li.
- Include appropriate metadata and UTF-8 encoding.
- Ensure the document renders correctly in Chromium/Puppeteer.
- Avoid external resources, scripts, and dependencies.
- Do not include Markdown fences or explanatory text outside the HTML field.

OUTPUT:
Return valid JSON matching the required schema, with exactly one field named
"html" containing the complete resume HTML.
`;

   const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
         responseMimeType: "application/json",
         responseSchema: resumePdfSchema
      }
   })
   const jsonContent = JSON.parse(response.text)
   const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
   return pdfBuffer
}
module.exports = { generateInterviewReport, generateResumePdf }


