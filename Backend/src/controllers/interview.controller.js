const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    if (!resumeFile && !selfDescription?.trim()) {
      return res.status(400).json({
        message: "Please upload a resume or provide a self-description.",
      });
    }

    let resumeText = "";

    if (resumeFile) {
      const resumeContent = await new pdfParse.PDFParse(
        Uint8Array.from(resumeFile.buffer)
      ).getText();

      resumeText = resumeContent.text || "";
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      message: "Interview Report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Interview report error:", error);

    return res.status(500).json({
      message: "Report generation failed. Please try again.",
    });
  }
}

async function getInterviewByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  return res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .select(
      "-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
    )
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

module.exports = {
  generateInterviewReportController,
  getInterviewByIdController,
  getAllInterviewReportsController,
}
