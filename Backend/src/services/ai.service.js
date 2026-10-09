const {GoogleGenAI}=require("@google/genai")
const {z}=require("zod")
const{zodToJsonSchema}=require("zod-to-json-schema")
const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
})
const interviewReportSchema=z.object({
    matchScore:z.number().describe("A score between 0 and 100 indicating how well the candidate's profile macthes the job description"),

       technicalQuestions:z.array(z.object({
          question:z.string().describe("the technical question can be asked in the interview"),
          intention:z.string().describe("the intention of interviewer behind asking this question"),
          answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
       })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

       behaviourQuestions:z.array(z.object({
         question:z.string().describe("the technical question can be asked in the interview"),
          intention:z.string().describe("the intention of interviewer behind asking this question"),
          answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
       })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

       skillPlan:z.array(z.object({
           skill:z.string().describe("The skill which the candidate is lacking"),
           severity:z.enum(["low","medium","high"]).describe("The severity of skill gap, i.e how important is")
       })).describe("List of skill gaps in the candidate's profile along with their severity"),

       preparationPlans:z.array(z.object({
        day:z.number().describe("The day Number in the preparation plan,starting from 1"),
        focus:z.string().describe("The main focus of this day in the preparation plan,e.g.data structure,system design.mock interviews"),
        tasks:z.string().describe("List of tasks to be done on this day to follow the preparation plan,e.g. read a specific book")
       })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively")
})
async function generateInterviewReport({resume,selfDescription,jobDescription}){
   const prompt=`Generate an interview report for a candidate with the following details:
        Resume:${resume},
        self Description:${selfDescription},
        job Description: ${jobDescription}
   
   `

  const response=await ai.models.generateContent({
     model:"gemini-3.1-flash-lite",
     contents:prompt,
     config:{
        responseMimeType:"application/json",
        responseSchema:zodToJsonSchema(interviewReportSchema)
     }
  })
    return JSON.parse(response.text)
}
module.exports=generateInterviewReport


