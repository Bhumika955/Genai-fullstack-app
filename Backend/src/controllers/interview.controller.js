const pdfParse=require("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")
async function generateInterviewReportController(req,res){
  const resumeFile=req.file
  const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
  const {selfDescription,jobDescription}=req.body
  const interviewReportByAi=await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription
  })

const report = interviewReportByAi

const interviewReport=await interviewReportModel.create({
    user:req.user.id,
    resume:resumeContent.text,
    selfDescription,
    jobDescription,
    ...report
})
  res.status(201).json({
    message:"Interview Report genearted Successfully",
    interviewReport
  })
}

module.exports={generateInterviewReportController}