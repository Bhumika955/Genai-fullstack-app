const { GoogleGenAI, Type } = require("@google/genai")

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
   },
   required: [
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
1. matchScore: Return a number between 0 and 100.

2. technicalQuestions: Return an array of objects. Each object must contain:
- question: A technical interview question.
- intention: What the interviewer wants to evaluate.
- answer: A sample answer explaining the key points.

3. behavioralQuestions: Return an array of objects. Each object must contain:
- question: A behavioral interview question.
- intention: What the interviewer wants to evaluate.
- answer: A sample answer based on the candidate's background. Do not invent specific experiences.

4. skillGaps: Return an array of objects. Each object must contain:
- skill: A skill the candidate needs to improve based on the resume and job description.
- severity: Exactly "low", "medium", or "high".

5. preparationPlan: Return an array of 7 objects. Each object must contain:
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
module.exports = generateInterviewReport


